"sql/newGolfGame.sql".gfdp(data).query((err, rows, fields) => {
  if (err) {
    objResp = stdSQLProc(err, rows);
    response.write(JSON.stringify(objResp));
    response.end();
    return;
  }
  "sql/getGolfGameID.sql".gfdp(data).query((err, rows, fields) => {
    objResp = stdSQLProc(err, rows[0]);
    response.write(JSON.stringify(objResp));
    response.end();
  });
});
