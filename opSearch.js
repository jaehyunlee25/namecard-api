const fs = require("fs");
const { isFunction } = require("lodash");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};
String.prototype.has = function (str) {
  return this.indexOf(str) != -1;
};

const clubName = "gumi";
const pathDict = "./script/search_core/";

const files = fs.readdirSync(pathDict);
files.forEach((file) => {
  const full = pathDict + file;
  const con = fs.readFileSync(full, "utf-8");
  log(con);
});
