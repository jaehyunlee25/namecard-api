    "sql/setDbGolfClubOuterInfo.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          outer_type: "error",
          outer_data: err,
        };
      } else {
        objResp = {
          outer_type: "okay",
          outer_data: rows,
        };
      }
      "sql/setDbGolfClub.sql".gfdp(data).query((err, rows, fields) => {
        if (err) {
          objResp.type = "error";
          objResp.data = err;
        } else {
          objResp.type = "okay";
          objResp.data = rows;
        }
        response.write(JSON.stringify(objResp));
        response.end();
        "sql/getGolfClub.sql".gf().query((err, rows, fields) => {
          golfClubs = {};
          rows.forEach((row) => {
            golfClubs[row.id] = row;
          });
        });
      });
    });