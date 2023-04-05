const archivePath = "/var/www/html/teelog/";
const logArchiveList = fs.readdirSync(archivePath);
const dt = data.date.rm("-");
let chk;
logArchiveList.forEach((file) => {
  if (file.has(dt)) chk = file;
});
if (chk) {
  const con = fs.readFileSync(archivePath.add(chk), "utf-8").jp();
  const res = [];
  con.forEach((ob) => {
    if (ob.device_id == data.device_id && ob.golf_club_id == data.golf_club_id)
      res.push(ob);
  });
  res.sort((a, b) => a.timestamp - b.timestamp);
  objResp = {
    type: "okay",
    data: res,
  };
} else {
  "sql/getLog.sql".gfdp(data).query((err, rows, fields) => {
    if (err) {
      objResp = {
        type: "error",
        data: err,
      };
    } else {
      objResp = {
        type: "okay",
        data: rows,
      };
    }
    response.write(JSON.stringify(objResp));
    response.end();
  });
}
