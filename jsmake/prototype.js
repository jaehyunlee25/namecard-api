String.prototype.dp = function (param) {
  let self = this;
  const keys = Object.keys(param);
  keys.forEach((key) => {
    const regex = new RegExp("\\$\\{".add(key).add("\\}"), "g");
    const val = param[key];
    self = self.replace(regex, val);
  });
  return self;
};
String.prototype.add = function add(str) {
  return [this, str].join("");
};
String.prototype.jp = function () {
  return JSON.parse(this);
};
String.prototype.gf = function () {
  const path = this.toString();
  return fs.readFileSync(path, "utf-8");
};
String.prototype.gfjp = function () {
  return this.toString().gf().jp();
};
String.prototype.gfdp = function (param) {
  // log(this.toString().gf().dp(param));
  return this.toString().gf().dp(param);
};
String.prototype.query = function (callback) {
  try {
    const sql = this.toString();
    const dbconf = "db.json";
    const connection = mysql.createConnection(dbconf.gfjp());
    connection.connect();
    connection.query(sql, callback);
    connection.end();
  } catch (e) {
    console.error(e);
  }
};
String.prototype.howmany = function (str) {
  let num = this.match(new RegExp(str, "g"));
  if (!num) num = 0;
  else num = num.length;
  return num;
};
Array.prototype.lo = function () {
  const idx = this.length - 1;
  return this[idx];
};
