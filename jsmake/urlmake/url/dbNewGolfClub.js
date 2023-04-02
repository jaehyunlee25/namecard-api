    "sql/newDbGolfClub.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
        response.write(JSON.stringify(objResp));
        response.end();
        return;
      }
      "sql/getGolfClubRaw.sql".gf().query((err, rows, fields) => {
        const clubs = {};
        rows.forEach((row) => {
          clubs[row.id] = row;
        });
        objResp = {
          type: "okay",
          data: clubs,
        };
        response.write(JSON.stringify(objResp));
        response.end();
      });
    });