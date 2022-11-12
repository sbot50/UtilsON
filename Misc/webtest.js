const got = require("got");

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

module.exports = {
  isimg: async (url) => {
    let fetched;
    let error;
    try {
      fetched = await timeout(3000, got(url));
    } catch (err) {
      error = 1;
    }
    if (error == 1) {
      return false;
    } else {
      return fetched.headers["content-type"];
    }
  },
};
