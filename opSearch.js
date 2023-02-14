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
String.prototype.regex = function (re) {
  return re.exec(this);
};

const clubName = "gumi";
const pathDict = "./script/search_dict/";

const files = fs.readdirSync(pathDict);
files.forEach((file) => {
  const full = pathDict + file;
  const con = fs.readFileSync(full, "utf-8");
  try {
    const jsn = JSON.parse(con);
    jsn.forEach(([title, addr, func], i) => {
      if (addr.regex(/\s/g)) {
        log(file);
        log(title, addr, func);
      }
    });
  } catch (e) {
    log(file);
    log(e);
  }
});
