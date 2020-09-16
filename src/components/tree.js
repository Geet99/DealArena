import React, { useState, useRef } from "react";
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath
  //toggleExpandedForAll
} from "react-sortable-tree";
import "react-sortable-tree/style.css";

const seed = [];

function Tree() {
  const [searchString] = useState("");
  const [searchFocusIndex] = useState(0);
  const [treeData, setTreeData] = useState(seed);

  const inputEl = useRef();

  function createNode() {
    const value = inputEl.current.value;

    if (value === "") {
      inputEl.current.focus();
      return;
    }

    let newTree = addNodeUnderParent({
      treeData: treeData,
      parentKey: null,
      expandParent: true,
      getNodeKey,
      newNode: {
        id: "123",
        title: value
      }
    });

    setTreeData(newTree.treeData);

    inputEl.current.value = "";
  }

  function updateNode(rowInfo) {
    const { node, path } = rowInfo;
    const { children } = node;

    const value = inputEl.current.value;

    if (value === "") {
      inputEl.current.focus();
      return;
    }

    let newTree = changeNodeAtPath({
      treeData,
      path,
      getNodeKey,
      newNode: {
        children,
        title: value
      }
    });

    setTreeData(newTree);

    inputEl.current.value = "";
  }

  function addNodeChild(rowInfo) {
    let { path } = rowInfo;

    const value = inputEl.current.value;

    if (value === "") {
      inputEl.current.focus();
      return;
    }

    let newTree = addNodeUnderParent({
      treeData: treeData,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey,
      newNode: {
        title: value
      }
    });

    setTreeData(newTree.treeData);

    inputEl.current.value = "";
  }

  // function addNodeSibling(rowInfo) {
  //   let { path } = rowInfo;

  //   const value = inputEl.current.value;

  //   if (value === "") {
  //     inputEl.current.focus();
  //     return;
  //   }

  //   let newTree = addNodeUnderParent({
  //     treeData: treeData,
  //     parentKey: path[path.length - 2],
  //     expandParent: true,
  //     getNodeKey,
  //     newNode: {
  //       title: value
  //     }
  //   });

  //   setTreeData(newTree.treeData);

  //   inputEl.current.value = "";
  // }

  function removeNode(rowInfo) {
    const { path } = rowInfo;
    setTreeData(
      removeNodeAtPath({
        treeData,
        path,
        getNodeKey
      })
    );
  }

  function updateTreeData(treeData) {
    setTreeData(treeData);
  }

  // function expand(expanded) {
  //   setTreeData(
  //     toggleExpandedForAll({
  //       treeData,
  //       expanded
  //     })
  //   );
  // }

  // function expandAll() {
  //   expand(true);
  // }

  // function collapseAll() {
  //   expand(false);
  // }

  const getNodeKey = ({ treeIndex }) => treeIndex;

  // function changeBackground(e) {
  //   e.target.style.background = 'red';
  // }

  return (
    <div>
      <div style={{ flex: "0 0 auto", padding: "0 15px" }}>
        <input hint="Enter text" ref={inputEl} type="text" />
        <br />
        <button onClick={createNode}>Create Node</button>
        <br />
        {/* <button onClick={expandAll}>Expand All</button>
        <button onClick={collapseAll}>Collapse All</button> */}
        <form
          style={{ display: "inline-block" }}
          onSubmit={event => {
            event.preventDefault();
          }}
        >
        </form>
      </div>

      <div style={{ height: "100vh" }}>
        <SortableTree
          treeData={treeData}
          onChange={treeData => updateTreeData(treeData)}
          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          canDrag={({ node }) => !node.dragDisabled}
          generateNodeProps={rowInfo => ({
            buttons: [
              <div>
                {/* <button
                  style={{size: "100px", height: "100px", width: "100px" }}
                  label="Add Sibling"
                  onClick={event => addNodeSibling(rowInfo)}
                >
                <img src="images/add_icon.png" alt="a"/>
                </button> */}
                <button
                  label="Add Child" 
                  hover={{text: "Add Child"}} 
                  onClick={event => addNodeChild(rowInfo)}
                >
                  <img src="images/add_icon.png" alt="add" style={{size: "20px", height: "20px", width: "20px"}} />
                </button>
                <button label="Update" onClick={event => updateNode(rowInfo)}>
                  <img src="images/edit_icon.png" alt="edit" style={{size: "20px", height: "20px", width: "20px"}} />
                </button>
                <button label="Delete" onClick={event => removeNode(rowInfo)}>
                  <img src="images/delete_icon.png" alt="delete" style={{size: "20px", height: "20px", width: "20px"}} />
                </button>
              </div>
            ],
            style: {
              height: "50px"
            }
          })}
        />
      </div>
    </div>
  );
}

export default Tree;