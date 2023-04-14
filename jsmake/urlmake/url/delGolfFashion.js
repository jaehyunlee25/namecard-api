"sql/delGolfFashion.sql".gfdp(data).query((err, rows, fields) => {
  const addr =
    "https://mnemosynesolutions.co.kr/app/project/editor_source_golf/img/upload/";
  rows.forEach((row) => {
    row.thumbnail = addr + row.thumbnail;
  });
  objResp = stdSQLProc(err, rows);
  response.write(JSON.stringify(objResp));
  response.end();
});
