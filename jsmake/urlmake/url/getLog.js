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
    getLog((err, rows, fields) => {
      objResp = { resultCode: 200, message: "okay", data: rows };
      response.write(JSON.stringify(objResp));
      response.end();
    });