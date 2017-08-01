class HttpWrapper {
  static sendRequest(url, config) {
    return fetch(url, config)
      .then((result) => {
        if (result.ok) return result.json();
        else {
          throw new Error();
        }
      });
  }

  static get(url) {
    return HttpWrapper.sendRequest(url);
  }
}

export default HttpWrapper;
