const got = require("got");

module.exports = {
  execute: async (code, file) => {
    file = file.replace("/home/runner/", "");
    let body = { content: code + " - " + file };
    let url;
    if (code > 499) {
      url = process.env.SERVER_ERROR;
    } else {
      url = process.env.CLIENT_ERROR;
    }
    got.post(url, {
      json: body
    });
  },
};
