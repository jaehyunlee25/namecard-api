    "sql/getGolfClub.sql".gf().query((err, rows, fields) => {
      golfClubs = {};
      rows.forEach((row) => {
        golfClubs[row.id] = row;
        golfClubs[row.id].eng_id = golfClubIdToEng[row.id];
        golfClubs[row.id].course_name = golfCourses[row.id]
          ? Object.keys(golfCourses[row.id]).join(",")
          : "";
      });
      objResp = {
        type: "okay",
        golfClubs,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });