const archivePath = "/var/www/html/teelog/";
const logArchiveList = fs.readdirSync(archivePath);
const dt = data.date.rm("-");
let chk;
logArchiveList.forEach((file) => {
  if (file.has(dt)) chk = file;
});
if (chk) {
  const con = fs.readFileSync(archivePath.add(chk), "utf-8").jp();
  const dids = con.map((ob) => ob.golf_club_id);
  const arr = dids.filter((id, i) => dids.indexOf(id) === i);
  const res = [];
  arr.forEach((golf_club_id) => {
    res.push({ golf_club_id });
  });
  objResp = {
    type: "okay",
    data: res,
  };
} else {
  "sql/getLogClubList.sql".gfdp(data).query((err, rows, fields) => {
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
