import fetch from "isomorphic-fetch";
const express = require('express');
const fs = require('fs');
import PersonRepo from './src/repo/PersonRepo';
var neo4j = require('neo4j-driver').v1;

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','anuabuann'));
var session = driver.session();

function createMyJson(data){
  let d3Structure = {
    nodes : [
      {
        name : "abu",
        group : 1
      },
      {
        name : "anu",
        group : 2
      }
    ],
    links : [
      {
        source : 1,
        target : 1
      },
      {
        source : 2,
        target : 2
      }
    ]
  }
  return d3Structure;
}

app.get('/person', (req, res) => {
  console.log(req.query.name);
  session
    .run('match(n) where n.name="Joseph Cook" RETURN n.name,n.level1,n.level2,n.level3,n.level4,n.level5')
    .then(function(result){
      const singleRecord = result.records[0];

      res.json(createMyJson(singleRecord._fields));
    })
    .catch(function(err){
      console.log(err);
    });

});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
