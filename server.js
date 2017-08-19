import fetch from "isomorphic-fetch";
const express = require('express');
const fs = require('fs');
var neo4j = require('neo4j-driver').v1;

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('',''));
var session = driver.session();

function createMyJson(data){
  let count=2;
  let edgeCount=0;
  let nodes = [];
  let edges = [];
  let thesis = data[6];
  let country = data[7];
  let insitute = data[8];
  var newEdge;
  let newNode = {id:1, label:data[0], color: '#808000'};
  nodes.push(newNode);
  let data2= JSON.parse(data[2]);
  data2.map(function(connection) {
      let teacher = Object.keys(connection)[0];
      let teacherId = count ++;
      let teachersTeacher = connection[teacher];
      if(teacher!=''){
      newNode = {id: teacherId, label: teacher, color: '#00FE32'}
      newEdge = {from: 1, to: teacherId, label:"teacher"}
      nodes.push(newNode);
      edges.push(newEdge);
      teachersTeacher.map(function(newTeacher){
        let seniorTeacherId = count ++;
        if(newTeacher!=''){
          newNode = {id: seniorTeacherId, label: newTeacher, color: '#00E7FE'}
          newEdge = {from: teacherId, to: seniorTeacherId, label:"teacher"}
          nodes.push(newNode);
          edges.push(newEdge);
        }
      });
    }

  });

  let data4= JSON.parse(data[4]);
  data4.map(function(connection) {
      let student = Object.keys(connection)[0];
      let studentid = count ++;
      let studentsStudent = connection[student];
      if(student!=''){
      newNode = {id: studentid, label: student, color: '#D2EF1A'}
      newEdge = {from: 1, to: studentid, label:"student"}
      nodes.push(newNode);
      edges.push(newEdge);
      studentsStudent.map(function(newStudent){
        let babyStudentId = count ++;
        if(newStudent!=''){
          newNode = {id: babyStudentId, label: newStudent, color: '#00E7FE'}
          newEdge = {from: studentid, to: babyStudentId, label:"student"}
          nodes.push(newNode);
          edges.push(newEdge);
        }
      });
    }

  });
  return {nodes, edges, thesis, country, insitute};
}

app.get('/person', (req, res) => {
  session
    .run(`match(n) where n.name='${req.query.name}' RETURN n.name,n.level1,n.level2,n.level3,n.level4,n.level5,n.thesis,n.country,n.institute`)
    .then(function(result){

      const singleRecord = result.records[0];
      let data = singleRecord._fields;
      //let data2= JSON.parse(data[1]);
      //console.log(data[6]);
      res.json(createMyJson(singleRecord._fields));
    })
    .catch(function(err){
      console.log(err);
    });

});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
