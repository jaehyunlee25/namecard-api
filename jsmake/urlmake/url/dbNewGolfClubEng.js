    "sql/newDbGolfClubEng.sql".gfdp(data).query((err, rows, fields) => {
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
      "sql/golfClubNames.sql".gf().query((err, rows, fields) => {
        golfClubEngNames = [];
        golfClubIds = {};
        golfClubIdToEng = {};
        golfClubEngToKor = {};
        rows.forEach((row) => {
          golfClubEngNames.push(row.eng_id);
          golfClubIds[row.eng_id] = row.golf_club_id;
          golfClubIdToEng[row.golf_club_id] = row.eng_id;
          golfClubEngToKor[row.eng_id] = row.name;
        });
      });
    });