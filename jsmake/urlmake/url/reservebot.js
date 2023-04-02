    objResp = reservebotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
      const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
      const loginUrl = golfClubLoginUrl[engName];
      const searchUrl = golfClubSearchUrl[engName];
      const reserveUrl = golfClubReserveUrl[engName];
      const loginScript = getPureLoginScript(engName);
      let templateScript;
      if (fs.existsSync("script/reserve/reserve/" + engName + ".js"))
        templateScript = fs.readFileSync(
          "script/reserve/reserve/" + engName + ".js",
          "utf-8"
        );
      else templateScript = fs.readFileSync("reserveTemplate.js", "utf-8");
      const script = templateScript.dp({
        year,
        month,
        date,
        course,
        time,
        commonScript,
        loginUrl,
        searchUrl,
        reserveUrl,
        loginScript,
      });
      objResp = {
        url: loginUrl,
        script,
      }; */