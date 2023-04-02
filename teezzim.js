const fs = require("fs");
const { exec } = require("child_process");
const log = function () {
  console.log("\n\n>> new log :: ", new Date());
  console.log(Array.from(arguments).join(", "));
};
const dir = function (arg) {
  console.log("\n\n>> new dir :: ", new Date());
  console.dir(arg);
};
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const app = [];
app.push(fs.readFileSync("jsmake/header.js", "utf-8"));
app.push(fs.readFileSync("jsmake/prototype.js", "utf-8"));
app.push(fs.readFileSync("jsmake/prolog.js", "utf-8"));

const procurl = ["function procPost(request, response, data) {"];
procurl.push(fs.readFileSync("jsmake/urlmake/header.js", "utf-8"));

const urls = fs.readdirSync("jsmake/urlmake/url");
urls.forEach((file) => {
  const con = fs.readFileSync("jsmake/urlmake/url/" + file, "utf-8");
  procurl.push(`} else if (reqUrl == "/${file.ct(3)}" ) {`);
  procurl.push(con);
});

procurl.push(fs.readFileSync("jsmake/urlmake/footer.js", "utf-8"));
procurl.push("}");
fs.writeFileSync("jsmake/procUrl.js", procurl.join("\r\n"), "utf-8");

app.push(fs.readFileSync("jsmake/procUrl.js", "utf-8"));

app.push(fs.readFileSync("jsmake/function.js", "utf-8"));
app.push(fs.readFileSync("jsmake/server.js", "utf-8"));
fs.writeFileSync("app.js", app.join("\r\n"), "utf-8");

const child = exec("node app.js");

child.stdout.on("data", (data) => {
  log(data);
});

child.stderr.on("data", (data) => {
  log(data);
});

child.on("error", (error) => {
  log(data);
});

child.on("close", (code) => {
  log(`child process exited with code ${code}`);
});
