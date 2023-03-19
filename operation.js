const fs = require("fs");
const { isFunction } = require("lodash");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const from = "village";
const to = "vivid";
const path = "./script/link/login/";
const fromCon = fs.readFileSync(path + from + ".js", "utf-8");
fs.writeFileSync(path + to + ".js", fromCon, "utf-8");
