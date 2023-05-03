"sql/delGolfGame.sql".gfdp(data).query((err, rows, fields) => {
  if (err) {
    objResp = {
      type: "error: while removing golf game",
      data: err,
    };
    response.write(JSON.stringify(objResp));
    response.end();
  }
  "sql/delGolfScore.sql".gfdp(data).query((err, rows, fields) => {
    if (err) {
      objResp = {
        type: "error: while removing golf score",
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
});
