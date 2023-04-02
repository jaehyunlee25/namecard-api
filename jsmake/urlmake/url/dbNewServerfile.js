    const { eng_id: eng } = data;
    const arRes = [
      ["login_url", golfClubLoginUrl[eng], "funcLogin"],
      ["search_url", golfClubSearchUrl[eng], "funcReserve"],
    ];
    const arObj = {
      LOGOUT:
        '  function LOGOUT() {\r\n    log("LOGOUT");\r\n    location.href="javascript:()=>{}";\r\n  }',
    };
    fs.writeFileSync(
      "script/search_dict/" + eng + ".json",
      JSON.stringify(arRes),
      "utf-8"
    );
    fs.writeFileSync(
      "script/search_logout/" + eng + ".json",
      JSON.stringify(arObj),
      "utf-8"
    );
    objResp = {
      type: "okay",
    };