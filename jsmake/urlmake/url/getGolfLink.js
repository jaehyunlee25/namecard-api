    if (data.section == undefined) data.section = "";
    "sql/getGolfLink.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });