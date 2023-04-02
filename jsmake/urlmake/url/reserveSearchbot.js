    objResp = reserveSearchbotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
      const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
      const loginUrl = golfClubLoginUrl[engName];
      const reserveUrl = golfClubReserveUrl[engName];
      const loginScript = getPureLoginScript(engName);
      let templateScript;
      if (fs.existsSync("script/reserve/search/" + engName + ".js"))
        templateScript = fs.readFileSync(
          "script/reserve/search/" + engName + ".js",
          "utf-8"
        );
      else
        templateScript = fs.readFileSync(
          "script/reserve/search/reserveSearchTemplate.js",
          "utf-8"
        );
      const golfClubId = golfClubIds[engName];
      const script = templateScript.dp({
        golfClubId,
        commonScript,
        loginUrl,
        reserveUrl,
        loginScript,
      });
      objResp = {
        url: loginUrl,
        script,
      }; */