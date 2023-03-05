const fs = require("fs");
const { isFunction } = require("lodash");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const path = "./script/search_core/";
const files = fs.readdirSync(path);
const addrs = [];
files.forEach((name) => {
  const addr = path + name;
  const con = fs.readFileSync(addr, "utf-8");
  if (con.indexOf("funcInterval, INTV_TIME") == -1) addrs.push(addr);
});

addrs.forEach((addr, i) => {
  log(addr);
  /* if (i > 0) return;
  const con = fs.readFileSync(addr, "utf-8");
  log(con); */
});
