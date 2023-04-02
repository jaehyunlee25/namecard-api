    const { clubIds, engIds, groupName } = data;
    const res = [];
    clubIds.forEach((id, i) => {
      let value = [
        "'" + groupName + "'",
        "'" + id + "'",
        "'" + engIds[i] + "'",
      ].join(",");
      res.push("(" + value + ")");
    });
    const group_values = res.join(",");
    "sql/newDbGroup.sql".gfdp({ group_values }).query((err, rows, fields) => {
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
      "sql/getGolfClubGroup.sql".gf().query((err, rows, fields) => {
        golfClubGroups = {};
        groupClubs = {};
        rows.forEach((row) => {
          groupClubs[row.golf_club_id] = row.name;
          if (!golfClubGroups[row.name]) golfClubGroups[row.name] = [];
          golfClubGroups[row.name].push(row);
        });
      });
    });