    log("test", data.result.length);
    const message = {
      GolfClub: golfClubs[data.golf_club_id],
      Game: [],
    };
    data.result.forEach((el) => {
      message.Game.push({
        game_date: el.date,
        game_time: el.time,
        GolfCourse: golfCourses[data.golf_club_id][el.course],
      });
    });
    objResp = {
      type: "okay",
      message,
    };