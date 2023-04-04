const fs = require("fs");
String.prototype.add = function (str) {
  return this + str;
};
const log = console.log;
const url = "test";

main();

function main() {
  if (!url) {
    log("error: url이 정확하지 않습니다");
    return;
  }
  // #1. 이미 있는 url이면 리턴한다.
  const path = "jsmake/urlmake/url/";
  const chk = fs.existsSync(path.add(url).add(".js"));
  if (chk) {
    log("error: 이미 존재하는 url입니다");
    return;
  }
  const sqlcon = fs.readFileSync("urlmaker/sqlmaker.sql", "utf-8");
  const sqls = {};
  let currentFile = "";
  sqlcon.split("\r\n").forEach((ln) => {
    if (ln.indexOf("//sqlname:") != -1) {
      const filename = ln.split(":")[1].trim();
      sqls[filename] ??= [];
      currentFile = filename;
      return;
    }
    sqls[currentFile].push(ln);
  });
  Object.entries(sqls).forEach(([filename, sql]) => {
    // #2. sql 유효성 체크
    const chk = fs.existsSync("sql/".add(filename).add(".sql"));
    if (chk) {
      log("이미 존재하는 sql 파일입니다.", filename);
      log("수정하려면 수정기능을 이용하세요.");
      return;
    }
    // #3. sql 파일 생성
    fs.writeFileSync(
      "sql/".add(filename).add(".sql"),
      sql.join("\r\n").trim(),
      "utf-8"
    );
  });
  //#4. url 파일 생성
  const urlcon = fs.readFileSync("urlmaker/script.js", "utf-8");
  fs.writeFileSync(path.add(url).add(".js"), urlcon, "utf-8");
}
