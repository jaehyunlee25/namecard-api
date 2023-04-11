"sql/getGolfGameScore.sql".gfdp(data).query((err, rows, fields) => {
  const res = {};
  rows.forEach((obj) => {
    res[obj.game_id] ??= [];
    res[obj.game_id].push(obj);
  });
  objResp = stdSQLProc(err, res);
  response.write(JSON.stringify(objResp));
  response.end();
});
