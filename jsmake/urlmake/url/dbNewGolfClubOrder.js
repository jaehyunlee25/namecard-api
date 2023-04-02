    "sql/newDbGolfClubOrder.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
        response.write(JSON.stringify(objResp));
        response.end();
        return;
      }
      objResp = {
        type: "okay",
        data: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });