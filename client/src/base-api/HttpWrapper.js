class HttpWrapper {
  static sendRequest(url, config) {
    console.log("sendRequest");
    return fetch(url, config)
      .then((result) => {
        console.log("RESULT : result");
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
