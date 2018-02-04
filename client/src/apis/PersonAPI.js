import HttpWrapper from '../base-api/HttpWrapper'

class PersonAPI{
 static getConnections(name){
  return HttpWrapper.get(`http://13.126.231.88:3001/person?name=${name}`);
 }
 static getGraph(name){
 	return HttpWrapper.get(`http://13.126.231.88:3001/graph?name=${name}`);
 }
}

export default PersonAPI;
