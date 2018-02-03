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
    this.__getAuthourData = this.__getAuthourData.bind(this);
    this.__closeModal = this.__closeModal.bind(this);
    this.__display = this.__display.bind(this);

    this.state = {
      graph: {
        nodes:[],
        edges:[]
      },
      name: '',
      modelOpen: false,
      author: [],
      modalType: ''
    };
  }

  __onNameChange(e){
    let value = e.target.value;
    this.setState({name:value})
  }

  __closeModal(){
    this.setState({modalOpen:false});
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
      this.setState({modalType: "GraphModal"});
      //var check =0;
    })
    .catch(()=>{console.log("error");})
  }

  __getAuthourData(){
    PersonAPI.getConnections(this.state.name)
    .then((result)=>{
      //var country = result.country;
      //var thesis = result.thesis;
      //var institute = result.institute;
      // console.log(result.country);
      console.log("HERE");
      console.log(result);
      let authourData = {
        // country: result.country,
        // thesis: result.thesis,
        // institute: result.insitute
        domain : result.domain,
        totalCitation : result.totalCitations,
        communityCitation : result.communityCitation,
        genelogicalCitation : result.genelogicalCitation,
        selfCitation : result.selfCitation,
        hIndex : result.hIndex,
        i10 : result.i10
      };
      this.setState({author: authourData});
      this.setState({modalOpen: true});
      //var check=1;
      this.setState({modalType: "DataField"});
    })
    .catch(()=>{console.log("error");})
  }

  __display() {
    console.log("modal type",this.state.modalType);
    if(this.state.modalType==="GraphModal"){
      return(
      <div>
        <div className="LegendBorder">
          <div className="LEGEND">
            <span><u>Legend</u></span>
          </div>
          <div className="AuthourLegend">
            <span>Referenced author</span>
          </div>
          <div className="Level1Legend">
            <span>Level 1</span>
          </div>
          <div className="Level2Legend">
            <span>Level 2</span>
          </div>
        </div>
        <Graph graph={this.state.graph} options={options} events={events} />
      </div>);
    }
    if(this.state.modalType==="DataField"){
      return(
        <div>
          <h1>Author Information</h1>
          <p>
          <span><b>Name: </b></span>
          <span>{this.state.name}</span>
          </p>
          <p>
          <span><b>Domain: </b></span>
          <span>{this.state.author.domain}</span>
          </p>
          <p>
          <span><b>Total Citations: </b></span>
          <span>{this.state.author.totalCitations}</span>
          </p>
          <p>
          <span><b>Self Citation: </b></span>
          <span>{this.state.author.selfCitation}</span>
          </p>
          <p>
          <span><b>Genelogical Citation: </b></span>
          <span>{this.state.author.genelogicalCitation}</span>
          </p>
          <p>
          <span><b>Community Citation: </b></span>
          <span>{this.state.author.communityCitation}</span>
          </p>
          <p>
          <span><b>H-Index: </b></span>
          <span>{this.state.author.hIndex}</span>
          </p>
          <p>
          <span><b>i10 Score: </b></span>
          <span>{this.state.author.i10}</span>
          </p>
        </div>
      );
    }
    return <h1>ji</h1>
  }



  render() {
    return (
      <div className="App">
        <h1>Computer Science Genealogy Graph</h1>
        <input type="text"
              placeholder="Enter Name"
              onChange={this.__onNameChange}
              value={this.state.name}
              />
        <div>
          <button className="searchButton" onClick = {this.__getConnections} >plot graph</button>
          <button className="getDataButton" onClick = {this.__getAuthourData} >Get authour data</button>
        </div>
        <div className="rightsReserved">
            <span>All rights reserved by SciBase</span>
        </div>
        <Modal
            isOpen={this.state.modalOpen}
            style={customStyle}
            contentLabel="Modal">
            <div>
              <button onClick = {this.__closeModal} >Close</button>
              {
                this.__display()
            }
            </div>

          </Modal>
      </div>
    );
  }
}

export default App;
