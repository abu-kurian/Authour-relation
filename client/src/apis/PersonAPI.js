import HttpWrapper from '../base-api/HttpWrapper'

class PersonAPI{
 static getConnections(name){
  return HttpWrapper.get(`person?name=${name}`);
 }
}

export default PersonAPI;
