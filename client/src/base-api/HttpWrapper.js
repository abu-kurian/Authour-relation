class HttpWrapper {
  static sendRequest(url, config) {
    // var headers = new Headers({
    //   'Content-Type': 'json'
    // });
    console.log("sendRequest");
    // console.log(url);
    return fetch(url)
      .then((result) => {
        // console.log("RESULT : " + JSON.stringify(result));
        if (result.ok) return result.json();
        else {
          throw new Error();
        }
      });
  }

  static get(url) {
    console.log("get");
    return HttpWrapper.sendRequest(url);
  }
}

export default HttpWrapper;
