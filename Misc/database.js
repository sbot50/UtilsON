const fs = require("fs");
const got = require("got");
const key = process.env.DB_TOKEN;

class Database {
  constructor(path) {
    this.data = {};
  }
  async load() {
    let res;
    try {
      res = await got("https://jsonbase.com/" + key + "/db").json();
      print("[DB] Loaded!");
    } catch {
      print("[DB] Can't load database")
    }
    if (res) {
      this.data = res;
      return this.data;
    }
  }
  async save() {
    if (!this.data || JSON.stringify(this.data) == "{}") {
      this.load();
      return console.info("[Db] Not loaded, load db.");
    }
    let res = await got.put("https://jsonbase.com/" + key + "/db", {
      json: this.data
    });
  }

  read(name) {
    if (!name) throw Error("Name cant be undefined!");
    return this.data[name];
  }
  write(name, value) {
    if (!name) throw Error("Name cant be undefined!");
    if (this.log)
      console.info(
        "[Db] Set " +
          name +
          " to " +
          value +
          " in " +
          this.filepath +
          " (was " +
          this.data[name] +
          ")"
      );
    this.data["" + name + ""] = value;
    return this;
  }
  delete(name) {
    if (!name) throw Error("Name cant be undefined!");
    if (this.data) {
      if (this.log)
        console.info(
          "[Db] Deleted " +
            name +
            " in " +
            this.filepath +
            " (was " +
            this.data[name] +
            ")"
        );
      this.data[name] = undefined;
      return true;
    } else return false;
  }
  all() {
    return this.data;
  }
  log(state) {
    if (this.log != state) {
      this.log = state;
      if (this.log) console.info("[Db] Enabled logging for " + this.filepath);
      if (!this.log) console.info("[Db] Disabled logging for " + this.filepath);
      return true;
    }
    return false;
  }

  clear() {
    let date = new Date().toString().split(" ").slice(1, 4).join("-");
    this.data = {};
    if (this.log) console.warn("[Db] Cleared all vars in " + this.filepath);
    if (this.log)
      console.warn("[Db] Backup: " + this.filepath + ".BACKUP-" + date);
  }

  backup() {
    let date = new Date().toString().split(" ").slice(1, 4).join("-");
    if (this.log)
      console.info(
        "[Db] Created backup for " +
          this.filepath +
          "as " +
          this.filepath +
          ".BACKUP-" +
          date
      );
    return this.filepath + ".BACKUP-" + date;
  }

  backups() {
    let path = this.filepath.split("/");
    let name = path.pop();
    let files = fs.readdirSync(path.join("/"));
    let backups = [];
    files.forEach((file) => {
      if (file.startsWith(name + ".BACKUP-")) {
        backups.push(file.split(".BACKUP-")[1]);
      }
    });
    return backups;
  }

  whole() {
    return this.data;
  }

  has(name) {
    return this.data[name] != undefined;
  }
  set(name, value) {
    return this.write(name, value);
  }

  get(name) {
    return this.read(name);
  }
  remove(name) {
    return this.delete(name);
  }
  setall(data) {
    this.data = data;
    return this.data;
  }
}

module.exports = Database;
