import React, { Component } from 'react';
import './App.css';
import PersonAPI from './apis/PersonAPI';
import Graph from 'react-graph-vis';
import Modal from 'react-modal';

let options = {
    layout: {
        hierarchical: false
    },
    edges: {
        color: "#000000"
    }
};

let customStyle = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
  },
  content : {
    position                   : 'absolute',
    top                        : '20%',
    left                       : '20%',
    right                      : '20%',
    bottom                     : '20%',
    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'

  }
};

let events = {
    select: function(event) {
        var { nodes, edges } = event;
        console.log("Selected nodes:");
        console.log(nodes);
        console.log("Selected edges:");
        console.log(edges);
    }
}

class App extends Component {


  constructor(props) {
    super(props);
    this.__onNameChange = this.__onNameChange.bind(this);
    this.__getConnections = this.__getConnections.bind(this);
    this.__closeModal = this.__closeModal.bind(this);

    this.state = {
      graph: {
        nodes:[],
        edges:[]
      },
      name: '',
      modelOpen: false
    };
  }

  __onNameChange(e){
    let value = e.target.value;
    this.setState({name:value})
  }

  __closeModal(){
    this.setState({modalOpen:false});
    this.setState({name:''})
  }

  __getConnections(){
    PersonAPI.getConnections(this.state.name)
    .then((result)=>{
      let graphLocal = {
        nodes: result.nodes,
        edges: result.edges
      };
      this.setState({graph: graphLocal});
      this.setState({modalOpen: true});
    })
    .catch(()=>{console.log("error");})
  }


  render() {
    return (
      <div className="App">
        <h1>Computer Science Genealogy Tree</h1>
        <input type="text"
              placeholder="Enter Name"
              onChange={this.__onNameChange}
              value={this.state.name}
              />
        <button className="searchButton" onClick = {this.__getConnections} >search</button>
        <Modal
            isOpen={this.state.modalOpen}
            style={customStyle}
            contentLabel="Modal">
            <button onClick = {this.__closeModal} >Close</button>
            <Graph graph={this.state.graph} options={options} events={events} />
          </Modal>
      </div>
    );
  }
}

export default App;
