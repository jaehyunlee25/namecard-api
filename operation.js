const fs = require("fs");
const log = console.log;

const con = fs.readFileSync("jsmake/procUrl.js", "utf-8");
const result = {};
let flg = false;
let url;
con.split("\r\n").forEach((ln, i) => {
  if (i > 1150 && ln.indexOf("} else {") != -1) flg = false;
  const regex = /reqUrl\s==\s\"\/(.+)\"/g;
  const res = regex.exec(ln);
  if (!res && flg) result[url].push(ln);
  if (!res) return;
  url = res[1];
  if (!result[url]) result[url] = [];
  flg = true;
});
Object.entries(result).forEach(([url, con]) => {
  con = con.join("\r\n");
  fs.writeFileSync("jsmake/urlmake/url/" + url + ".js", con, "utf-8");
});
