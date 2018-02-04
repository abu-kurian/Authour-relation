// import fetch from "isomorphic-fetch";
const express = require('express');
const fs = require('fs');
var neo4j = require('neo4j-driver').v1;
var request = require("request");
var cors = require("cors");

const app = express();
app.use(cors());

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// var driver = neo4j.driver("bolt://52.35.21.1:7687",neo4j.auth.basic('neo4j','scibase'));
// var session = driver.session();

var NEO4J_API_URL = "http://52.35.21.1:7474/db/data/transaction/commit";
var NEO4J_USER = "neo4j";
var NEO4J_PASS = "scibase";



function createMyJson(data){
  console.log("inside createMyJson");
  console.log(data);
  let count=2;
  let edgeCount=0;
  let nodes = [];
  let edges = [];
  // let thesis = data[6];
  // let country = data[7];
  // let insitute = data[8];
  let domain = data[1];
  let totalCitation = data[2];
  let genelogicalCitation = data[3];
  let communityCitation = data[4];
  let selfCitation = data[5];
  let hIndex = data[6];
  let i10 = data[7];

  var newEdge;
  let newNode = {id:1, label:data[0], color: '#808000'};
  nodes.push(newNode);
  // let data2= JSON.parse(data[2]);
  // data2.map(function(connection) {
  //     let teacher = Object.keys(connection)[0];
  //     let teacherId = count ++;
  //     let teachersTeacher = connection[teacher];
  //     if(teacher!=''){
  //     newNode = {id: teacherId, label: teacher, color: '#00FE32'}
  //     newEdge = {from: 1, to: teacherId, label:"teacher"}
  //     nodes.push(newNode);
  //     edges.push(newEdge);
  //     teachersTeacher.map(function(newTeacher){
  //       let seniorTeacherId = count ++;
  //       if(newTeacher!=''){
  //         newNode = {id: seniorTeacherId, label: newTeacher, color: '#00E7FE'}
  //         newEdge = {from: teacherId, to: seniorTeacherId, label:"teacher"}
  //         nodes.push(newNode);
  //         edges.push(newEdge);
  //       }
  //     });
  //   }

  // });

  // let data4= JSON.parse(data[4]);
  // data4.map(function(connection) {
  //     let student = Object.keys(connection)[0];
  //     let studentid = count ++;
  //     let studentsStudent = connection[student];
  //     if(student!=''){
  //       newNode = {id: studentid, label: student, color: '#D2EF1A'}
  //       newEdge = {from: 1, to: studentid, label:"student"}
  //       nodes.push(newNode);
  //       edges.push(newEdge);
  //       studentsStudent.map(function(newStudent){
  //         let babyStudentId = count ++;
  //         if(newStudent!=''){
  //           newNode = {id: babyStudentId, label: newStudent, color: '#00E7FE'}
  //           newEdge = {from: studentid, to: babyStudentId, label:"student"}
  //           nodes.push(newNode);
  //           edges.push(newEdge);
  //         }
  //       });
  //     }

  // });
  console.log("Returning from createMyJson");
  return {nodes, edges, domain, totalCitation, genelogicalCitation, communityCitation, selfCitation, hIndex, i10};
}


app.get('/person', (req, res) => {
  // session
  //   .run(`match(n) where n.name='${req.query.name}' RETURN n.Name,n.Domain,n.totalCitation,n.genelogicalCitation, n.communityCitation, n.selfCitation, n.hIndex, n.i10-index`)
  //   .then(function(result){

  //     const singleRecord = result.records[0];
  //     console.log("Single Record Fetched : " + singleRecord);
  //     let data = singleRecord._fields;
  //     //let data2= JSON.parse(data[1]);
  //     //console.log(data[6]);
  //     res.json(createMyJson(singleRecord._fields));
  //   })
  //   .catch(function(err){
  //     console.log(err);
  //   });

    var query = "match(n) where n.Name='"+req.query.name+"' RETURN n.Name,n.Domain,n.totalCitation,n.genelogicalCitation, n.communityCitation, n.selfCitation, n.hIndex, n.i10";
    console.log("Query : ", query);
    var auth_payload = new Buffer(NEO4J_USER + ":" + NEO4J_PASS).toString('base64');
    var request_json = {
        "statements": [{
            "statement": query
        }]
    };
    var neo = request({
        url: NEO4J_API_URL,
        method: "POST",
        json: request_json,
        headers: {
            "Authorization": "Basic " + auth_payload,
            "Accept": "application/json; charset=UTF-8"
        }
    }, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            console.log("BODY : " + JSON.stringify(body));
            const singleRecord = body.results[0].data[0].row;
            console.log("Single Record : " + singleRecord);
            var t = createMyJson(singleRecord);
            console.log("T : ", t);
            res.json(t);
        } else {
            console.log("API request failed with error: " + err);
            console.log("response.statusCode: " + response.statusCode);
            console.log("response.statusText: " + response.statusText);
        }
    }); // request ends

});


app.get('/graph', (req, res) =>{
    var queryHopDown = "MATCH (u:Author)<-[r:PARENT_OF]-(m:Author) WHERE u.Name='"+req.query.name+"' RETURN m.Name";
    var queryHopUp = "MATCH (u:Author)<-[r:PARENT_OF]-(m:Author) WHERE m.Name='"+req.query.name+"' RETURN u.Name";
    // console.log("Query : ", query);
    var auth_payload = new Buffer(NEO4J_USER + ":" + NEO4J_PASS).toString('base64');
    var request_json = {
        "statements": [{
            "statement": queryHopDown
        }, {
            "statement":  queryHopUp
        }]
    };
    var neo = request({
        url: NEO4J_API_URL,
        method: "POST",
        json: request_json,
        headers: {
            "Authorization": "Basic " + auth_payload,
            "Accept": "application/json; charset=UTF-8"
        }
    }, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            console.log("BODY : " + JSON.stringify(body));
            var dataDown = body.results[0].data;
            var dataUp = body.results[1].data;
            var authArray = [];
            var nodes = [];
            var edges = [];
            nodes.push({
              id : req.query.name,
              label : req.query.name,
              color: '#0000ff'
            });
            for(var i = 0; i<dataDown.length; i++){
              newNode = {id: dataDown[i].row[0], label: dataDown[i].row[0], color: '#00E7FE'}
              newEdge = {from: req.query.name, to: dataDown[i].row[0], label:"student"}
              nodes.push(newNode);
              edges.push(newEdge);
              // console.log(data[i].row[0]);
            }
            for(var i = 0; i<dataUp.length; i++){
              newNode = {id: dataUp[i].row[0], label: dataUp[i].row[0], color: '#aa4400'}
              newEdge = {from: dataUp[i].row[0], to: req.query.name, label:"student"}
              nodes.push(newNode);
              edges.push(newEdge);
              // console.log(data[i].row[0]);
            }
            var t = {nodes, edges};
            // console.log(t)

            console.log("T : ", t);
            res.json(t);
        } else {
            console.log("API request failed with error: " + err);
            console.log("response.statusCode: " + response.statusCode);
            console.log("response.statusText: " + response.statusText);
        }
    }); // request ends
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
