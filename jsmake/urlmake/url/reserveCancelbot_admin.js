    objResp = reserveCancelbotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
      const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
      const loginUrl = golfClubLoginUrl[engName];
      const reserveUrl = golfClubReserveUrl[engName];
      const loginScript = getPureLoginScript(engName).dp({
        login_id: golfClubAccounts[engName].id,
        login_password: golfClubAccounts[engName].pw,
      });
      let templateScript;
      if (fs.existsSync("script/reserve/cancel/" + engName + ".js"))
        templateScript = fs.readFileSync(
          "script/reserve/cancel/" + engName + ".js",
          "utf-8"
        );
      else
        templateScript = fs.readFileSync(
          "script/reserve/cancel/reserveCancelTemplate.js",
          "utf-8"
        );
      const golfClubId = golfClubIds[engName];
      const script = templateScript.dp({
        year,
        month,
        date,
        course,
        time,
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