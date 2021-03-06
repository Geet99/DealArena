import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { TreeSelect } from 'antd';
import firebase from "./Config";
import history from './../history';

const { SHOW_PARENT } = TreeSelect;

var treeData = [
  {
    title: "Electronics",
    value: "Electronics",
    id: "E",
    children: [
      {
        title: "Apple",
        value: "Apple",
        id: "EA",
        parent: "E",
        children: [
          { 
            title: "Laptops", 
            value: "Laptops", 
            parent: "EA", 
            id: "EAL" 
          },
          { 
            title: "Earphones", 
            value: "Earphones", 
            parent: "EA", 
            id: "EAE" 
          }
        ]
      },
      {
        title: "Samsung",
        value: "Samsung",
        id: "ES",
        parent: "E",
        children: [
          { 
            title: "Mobiles", 
            value: "Mobiles",
            id: "ESM",
            parent: "ES",
          },
          { 
            title: "AirConditioner", 
            value: "AirConditioner",
            id: "ESA",
            parent: "ES",
          }
        ]
      },
    ]
  },
  {
    title: "Flights",
    value: "Flights",
    id: "F",
    children: [
      {
        title: "Indigo",
        value: "Indigo",
        id: "FI",
        parent: "F",
        children: [
          { 
            title: "DEL-BLR Flights", 
            value: "DEL-BLR Flights",
            id: "FIDB",
            parent: "FI",
          },
          { 
            title: "DEL-MUM Flights", 
            value: "DEL-MUM Flights",
            id: "FIDM",
            parent: "FI",
          }
        ]
      },
      {
        title: "Spicejet",
        value: "Spicejet",
        id: "FS",
        parent: "F",
      }
    ]
  },
  {
    title: "Footwear",
    value: "Footwear",
    id: "I",
    children: [
      {
        title: "Bata",
        value: "Bata",
        id: "IB",
        parent: "I",
        children: [
          {
            title: "FormalFootwear",
            value: "FormalFootwear",
            id: "IBF",
            parent: "IB",
          },
          {
            title: "CasualFootwear",
            value: "CasualFootwear",
            id: "IBC",
            parent: "IB",
          }
        ]
      },
      {
        title: "Adidas",
        value: "Adidas",
        id: "IA",
        parent: "I",
        children: [
          {
            title: "SportsFootwear",
            value: "SportsFootwear",
            id: "IAS",
            parent: "IA",
          }
        ]
      }
    ]
  }
];

treeData=treeData[0].children[1].children;
var offers=[];

class TreeCheck1 extends Component {

  constructor(props){
    super(props);
    this.state = {
       value:[] ,
       offers:[]
    };
  }

	onSubmit=(e)=>{
		this.state.offers.map(p=>{
      var Category=p.Category
      var SubCategory1 = p.SubCategory1
      var SubCategory2 = p.SubCategory2
      var SubCategory3 = p.SubCategory3
      var Model = p.Model
      var Description=p.Description
      var Name=p.Name
      var Offer=this.props.Offer
      var Expiry=this.props.Expiry
      var Brand=p.Brand
      var imageurl = p.imageurl
      var Price = p.Price

      firebase.firestore().collection("offerDetails").add({
        Category,Description,Name,Offer,Expiry,Brand, SubCategory1, SubCategory2, SubCategory3, Model, imageurl, Price
      })
      .catch((error)=>{
        console.error("Error adding document:",error);
      });
      return null;
    })
    history.push("/manageoffers");
  }

  clear() {
    this.setState({offers: []});
    console.log("reset");
  }

  onChange = value => {
    this.clear();

    console.log('onChange ', value);
    this.setState({ value });

    firebase.auth().onAuthStateChanged((productowner)=>{
			if (productowner){
			  firebase.firestore().collection("productOwnerDetails").doc(productowner.uid)
				.get()
				.then((doc)=> {
				  this.setState({brand : doc.data().brand});
				}).then((doc)=>{
      
          console.log("cdm value in onChange: ", this.state.value);
          this.ref=firebase.firestore().collection("productDetails").where("Brand","==",this.state.brand).where("SubCategory1","in", this.state.value);
        
          this.unsubscribe=this.ref.onSnapshot(this.onCollectionUpdate);
				})
				.catch(function(error){
				  console.log("Error getting document:", error);
				})
			}
		})
  };
  
  onCollectionUpdate=(querySnapshot)=>{
    querySnapshot.forEach((doc)=>{
        const {Model, Name, Brand, Description, Price, Category,imageurl, producturl,SubCategory1, SubCategory2, SubCategory3}=doc.data();
        offers.push({
            key:doc.id,
            doc,
            Brand,
            Name,
            Description,
            Price,
            Category,
            Model,
            SubCategory1,
            SubCategory2,
            SubCategory3,
            imageurl,
            producturl
        });
    });
    this.setState({offers});
    console.log(this.state.offers);
}

  componentDidUpdate(prev){
    if (this.props.propinterest !== prev.propinterest) {
      this.setState({value: this.props.propinterest})
      console.log(this.props);
    }
  }

  render() {
    const first = this.state.value;
    console.log("first[0] is: ", first[0]);
    console.log("first[1] is: ", first[1]);
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: 'Select nodes where you want to add',
      style: {
        width: "80%"
      }    
    };
    return( 
      <div>
        <TreeSelect {...tProps} />
        <button onClick={this.onSubmit} className="mb-2 btn btn-outline-primary btn-sm btn-pill">
          			<i className="material-icons mr-1">Add</i> 
        		</button>

      </div>
    )
  }
}

export default TreeCheck1;