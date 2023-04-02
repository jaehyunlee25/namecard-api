const fs = require("fs");

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
fs.writeFileSync("teezzim.js", app.join("\r\n"), "utf-8");
