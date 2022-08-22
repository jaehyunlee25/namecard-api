const fs = require("fs");
const { isFunction } = require("lodash");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const path = "./script/reserve_core/reserve/";
const files = fs.readdirSync(path);
files.forEach((folder, i) => {
  if(folder.indexOf(".") != -1) return;
  const con = fs.readFileSync(path + folder + "/funcs.json", "utf-8");
  const funcs = JSON.parse(con);
  Object.keys(funcs).forEach(key => {
    const str = funcs[key];
    const res = [];
    str.split("\r\n").forEach(ln => {
      if(ln.indexOf("const ac") != -1) return;
      res.push(ln);
    });
    funcs[key] = res.join("\r\n");    
  });
  fs.writeFileSync(path + folder + "/funcs.json", JSON.stringify(funcs), "utf-8");
  
  // if(i > 0) return;
  /* const con = fs.readFileSync(path + file, "utf-8");
  const res = [];
  con.split("\r\n").forEach(ln => {
    if (ln.indexOf("const ac") != -1) return;
    res.push(ln);
  });
  fs.writeFileSync(path + file, res.join("\r\n"), "utf-8"); */
});

/* const clubs = {};
const files = fs.readdirSync("./script/reserve/reserve/");
let count = 0;
files.forEach((file) => {
  let con = fs.readFileSync("./script/reserve/reserve/" + file, "utf-8");
  con = con.split("\r\n").join("\n");
  con = con.split("\n").join("\r\n");
  con.split("\r\n").every(ln => {
    const regex = /\s?const\s?fulldate\s?=\s?\[year\,\s?month\,\s?date\]\.join\(\"(.?)\"\)\;/;
    const res = regex.exec(ln);
    if(res) {
      const splt = res[1];
      const club = file.split(".")[0];
      const addr = "./script/reserve_core/reserve/" + club + "/splitterDate";
      if(fs.existsSync(addr)) 
        fs.writeFileSync(addr, splt, "utf-8");
    }

    return !res;
  });
}); */

/* const curClub = {};
let gochang;
Object.keys(clubs).forEach((key) => {
  if (key != "gochang") return;
  const club = clubs[key];
  gochang = club;
  const dates = Object.keys(club);
  dates.sort((a, b) => b - a);
  if (!curClub[key]) curClub[key] = {};
  curClub[key][dates[0]] = club[dates[0]];
});

const times = {};
Object.keys(gochang).forEach((time) => {
  if (!times[time]) times[time] = [];
  times[time].push(gochang[time]);
});
dir(times);
log(times["1659684711"]);

times["1659684711"][0].forEach((file) => {
  const con = fs.readFileSync(file[0], "utf-8");
  log(con);
  fs.writeFileSync(file[1], con, "utf-8");
}); */

/* Object.keys(curClub).forEach((key) => {
  const club = curClub[key];
  const date = Object.keys(club)[0];
  const files = club[date];
  files.forEach((file) => {
    const con = fs.readFileSync(file[0], "utf-8");
    fs.writeFileSync(file[1], con, "utf-8");
  });
}); */
