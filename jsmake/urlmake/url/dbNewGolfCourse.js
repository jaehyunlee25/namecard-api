    const { course_name, id } = data;
    const arCourse = course_name.replace(/\s/g, "").split(",");
    const res = [];
    arCourse.forEach((name) => {
      let value = [
        "uuid()",
        "'" + id + "'",
        "'" + name + "'",
        "'9홀'",
        "now()",
        "now()",
      ].join(",");
      res.push("(" + value + ")");
    });
    const course_values = res.join(",");
    "sql/newDbGolfCourse.sql"
      .gfdp({ course_values })
      .query((err, rows, fields) => {
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
        "sql/getGolfCourse.sql".gf().query((err, rows, fields) => {
          golfCourses = {};
          rows.forEach((row) => {
            if (!golfCourses[row.golf_club_id])
              golfCourses[row.golf_club_id] = {};
            golfCourses[row.golf_club_id][row.name] = row;
          });
        });
      });