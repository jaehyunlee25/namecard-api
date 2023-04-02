    console.log("url", reqUrl);
    const engName = data.club;
    const common = "script/common/common.js".gfdp(ENV);
    /* const clubscript = fs.readFileSync(
        "script/search/" + engName + ".js",
        "utf-8"
      ); */
    getSearchScript(engName, (clubscript) => {
      console.log(clubscript);
      const script = "javascript:(() => {" + common + clubscript + "})()";
      const url = golfClubSearchUrl[engName];
      objResp = {
        url,
        script,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });