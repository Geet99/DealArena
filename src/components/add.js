import 'bootstrap-css-only/css/bootstrap.min.css';
import React,{Component} from 'react';
import firebase from "./Config";
import history from './../history';

class Add extends Component{
    constructor(props){
		super(props);
		this.logout = this.logout.bind(this);
		this.unsubscribe=null;
		this.state={
			products:[]
		};
	}

	onInput=(e)=>{
		const state=this.state;
		state[e.target.name]=e.target.value;
		this.setState(state);
	  }
	
	componentDidMount(){
		this.checkAuth();
		firebase.auth().onAuthStateChanged((productowner)=>{
			if (productowner){
			  firebase.firestore().collection("productOwnerDetails").doc(productowner.uid)
				.get()
				.then((doc)=> {
				  this.setState({brand : doc.data().brand})
				}).then((doc)=>{
					this.ref=firebase.firestore().collection("productDetails").where("Brand","==",this.state.brand);
					this.unsubscribe=this.ref.onSnapshot(this.onCollectionUpdate);
				})
				.catch(function(error){
				  console.log("Error getting document:", error);
				})
			}
		})
	}

	onCollectionUpdate=(querySnapshot)=>{
		const products=[];
		const brand=[];
		querySnapshot.forEach((doc)=>{
			const {Model, Name, Description,Brand, Price, Expiry, Category, SubCategory1, SubCategory2, SubCategory3, Offer,imageurl, producturl}=doc.data();
			brand.push(Brand);
            products.push({
                key:doc.id,
				doc,
				Model,
                Name,
                Brand,
                Description,
                Price,
				Category,
				SubCategory1,
				SubCategory2,
				SubCategory3,
                Expiry,
                Offer,
                imageurl,
                producturl,
                
            });
        });
		this.setState({products});
		console.log(this.state.products);

		this.setState(brand);
	}

	checkAuth(){
		var produser = firebase.auth().currentUser;
		if(localStorage.getItem('usersession')){

		}
		else if(produser){
			localStorage.setItem('usersession', produser);
			console.log("User "+produser.uid+" is logged in with");
			history.push("/add");

		}
		else{
			console.log("Successfully logged out");
			history.push("/");
		}
	}

	logout(){
		firebase.auth().signOut()
		.then(function(){
			localStorage.removeItem('usersession');
			console.log("successfully logged out");
			history.push("/");
		})
		.catch(function(error){
			console.log(error);
		});
	}

	addoffer(u){
		var productId = u;
		localStorage.setItem('productsession', productId);
		history.push("/addoffer");
	}

	render() {
		// console.log(this.state.products);
		return (
			<div>
					<div className="row" style={{margin:"0.25vw"}}>	
					<div className="col-sm-10">	
						<h5>Add offer directly at any product:</h5>
						{this.state.products.map(product=>
							<div className="card-post mb-4 card card-small">
								<div className="card-body">
									<h7 className="card-title">{product.Category} -{">"} {product.Brand} -{">"} {product.SubCategory1} -{">"} {product.Model}</h7>
									<h5 className="card-title">{product.Name}</h5>
									<img src= {product.imageurl} alt="DealArena" width="100px" height="100px"/> <br />
									<h5 className="card-title"> {product.Brand}</h5>
									<h6 className="card-title"> {product.Description}</h6>
									<h6 className="card-title">Category: {product.Category}</h6>
								</div>

								<div className="border-top d-flex card-footer">
									<div className="card-post__author d-flex col-sm-8">
										<div className="d-flex flex-column justify-content-center ml-3">
											<span className="card-post__author-name">
												Rs.{product.Price}
											</span>
										</div>
									</div>

									<div className="d-flex flex-column">
										<button onClick={()=>this.addoffer(product.key)} className="mb-2 btn btn-outline-success btn-sm btn-pill">
											<i className="material-icons mr-1">Add offer</i> 
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
					</div>
			</div>
		)
	}
}

export default Add;