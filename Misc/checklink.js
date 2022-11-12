const got = require("got");

module.exports = {
  islink: async (url) => {
    let fetched;
    let error;
    try {
      await got(link);
    } catch (err) {
      error = 1;
    }
    if (error == 1) {
      return false;
    } else {
      return true;
    }
  },
};
