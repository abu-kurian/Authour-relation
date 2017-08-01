import React, { Component } from 'react';
import './App.css';
import PersonAPI from './apis/PersonAPI';
import Graph from 'react-graph-vis'

let graph = {
  nodes: [
      {id: 1, label: 'saha', color: '#e04141'},
      {id: 2, label: 'abu', color: '#e09c41'},
      {id: 3, label: 'Node 3', color: '#e0df41'},
      {id: 4, label: 'Node 4', color: '#7be041'},
      {id: 5, label: 'Node 5', color: '#41e0c9'}
    ],
  edges: [
      {from: 1, to: 2},
      {from: 1, to: 3},
      {from: 2, to: 4},
      {from: 2, to: 5}
    ]
};

let options = {
    layout: {
        hierarchical: false
    },
    edges: {
        color: "#000000"
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
    this.state = {
      graph: {
        nodes:[],
        edges:[]
      }
    };
  }

  componentDidMount() {
    PersonAPI.getConnections("Joseph Cook")
    .then((result)=>{
      let graphLocal = {
        nodes: result.nodes,
        edges: result.edges
      };
      this.setState({graph: graphLocal});

    })
    .catch(()=>{console.log("error");})
  }


  render() {
    return (
      <div className="App">
        <h1>GT</h1>
        <Graph graph={this.state.graph} options={options} events={events} />
      </div>
    );
  }
}

export default App;
