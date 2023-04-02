function stdSQLProc(err, rows) {
  let objResp;
  if (err) {
    log(err);
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
  return objResp;
}
function delDeviceDate(data, callback) {
  /* const connection = mysql.createConnection("db.json".gfjp());
    connection.connect();
    connection.query(
      "sql/delDeviceDate.sql".gfdp(data),
      (err, rows, fields) => {
        if (err) callback(err);
        else callback(rows);
      }
    );
    connection.end(); */
  "sql/delDeviceDate.sql".gfdp(data).query((err, rows, fields) => {
    if (err) callback(err);
    else callback(rows);
  });
}
function delDeviceTime(data, callback) {
  /* const connection = mysql.createConnection("db.json".gfjp());
    connection.connect();
    connection.query(
      "sql/delDeviceTime.sql".gfdp(data),
      (err, rows, fields) => {
        if (err) callback(err);
        else callback(rows);
      }
    );
    connection.end(); */
  "sql/delDeviceTime.sql".gfdp(data).query((err, rows, fields) => {
    if (err) callback(err);
    else callback(rows);
  });
}
function getLog(callback) {
  const query = "select * from LOG order by id asc limit 1000;";
  query.query(callback);
}
function setGolfClubState(data, callback) {
  /* const connection = mysql.createConnection(
      JSON.parse(fs.readFileSync("db.json", "utf-8"))
    );
    connection.connect();
    connection.query(
      fs.readFileSync("sql/setGolfClubState.sql", "utf-8").dp(data),
      (err, rows, fields) => {
        if (err) callback(err);
        else callback(rows);
      }
    );
    connection.end(); */
  "sql/setGolfClubState.sql".gfdp(data).query((err, rows, fields) => {
    if (err) callback(err);
    else callback(rows);
  });
}
function setReserveCancel(data) {
  if (!fs.existsSync("script/reserve_core/cancel/" + data.club))
    fs.mkdirSync("script/reserve_core/cancel/" + data.club);

  /* dict file backup */
  const dictPath = "script/reserve_core/cancel/" + data.club + "/dict.json";
  if (fs.existsSync(dictPath)) {
    const con = fs.readFileSync(dictPath);
    const backupPath = "script/backup/reserve_cancel_dict_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dictPath, JSON.stringify(data.dict), "utf-8");

  /* funcs file backup */
  const funcPath = "script/reserve_core/cancel/" + data.club + "/funcs.json";
  if (fs.existsSync(funcPath)) {
    const con = fs.readFileSync(funcPath);
    const backupPath = "script/backup/reserve_cancel_funcs_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(funcPath, JSON.stringify(data.funcs), "utf-8");

  /* dictCourse file backup */
  const dcPath = "script/reserve_core/cancel/" + data.club + "/dictCourse.json";
  if (fs.existsSync(dcPath)) {
    const con = fs.readFileSync(dcPath);
    const backupPath = "script/backup/reserve_cancel_dictCourse_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dcPath, JSON.stringify(data.dictCourse), "utf-8");

  return {
    msg: "successfully saved!!",
    code: 200,
  };
}
function setReserveSearch(data) {
  if (!fs.existsSync("script/reserve_core/search/" + data.club))
    fs.mkdirSync("script/reserve_core/search/" + data.club);

  /* dict file backup */
  const dictPath = "script/reserve_core/search/" + data.club + "/dict.json";
  if (fs.existsSync(dictPath)) {
    const con = fs.readFileSync(dictPath);
    const backupPath = "script/backup/reserve_search_dict_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dictPath, JSON.stringify(data.dict), "utf-8");

  /* funcs file backup */
  const funcPath = "script/reserve_core/search/" + data.club + "/funcs.json";
  if (fs.existsSync(funcPath)) {
    const con = fs.readFileSync(funcPath);
    const backupPath = "script/backup/reserve_search_funcs_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(funcPath, JSON.stringify(data.funcs), "utf-8");

  /* dictCourse file backup */
  const dcPath = "script/reserve_core/search/" + data.club + "/dictCourse.json";
  if (fs.existsSync(dcPath)) {
    const con = fs.readFileSync(dcPath);
    const backupPath = "script/backup/reserve_search_dictCourse_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dcPath, JSON.stringify(data.dictCourse), "utf-8");

  return {
    msg: "successfully saved!!",
    code: 200,
  };
}
function setReserveReserve(data) {
  if (!fs.existsSync("script/reserve_core/reserve/" + data.club))
    fs.mkdirSync("script/reserve_core/reserve/" + data.club);

  /* dict file backup */
  const dictPath = "script/reserve_core/reserve/" + data.club + "/dict.json";
  if (fs.existsSync(dictPath)) {
    const con = fs.readFileSync(dictPath);
    const backupPath = "script/backup/reserve_reserve_dict_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dictPath, JSON.stringify(data.dict), "utf-8");

  /* funcs file backup */
  const funcPath = "script/reserve_core/reserve/" + data.club + "/funcs.json";
  if (funcPath) {
    const con = fs.readFileSync(funcPath);
    const backupPath = "script/backup/reserve_reserve_funcs_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(funcPath, JSON.stringify(data.funcs), "utf-8");

  /* dictCourse file backup */
  const dcPath =
    "script/reserve_core/reserve/" + data.club + "/dictCourse.json";
  if (fs.existsSync(dcPath)) {
    const con = fs.readFileSync(dcPath);
    const backupPath = "script/backup/reserve_reserve_dictCourse_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dcPath, JSON.stringify(data.dictCourse), "utf-8");

  /* splitterDate file backup */
  const sdPath = "script/reserve_core/reserve/" + data.club + "/splitterDate";
  if (sdPath) {
    const con = fs.readFileSync(sdPath);
    const backupPath = "script/backup/reserve_reserve_splitterDate_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(sdPath, data.splitterDate, "utf-8");

  return {
    msg: "successfully saved!!",
    code: 200,
  };
}
function reserveCancelbotAdmin(data) {
  const { club: engName, year, month, date, course, time } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const reserveUrl = golfClubReserveUrl[engName];
  const loginScript = getPureLoginScript(engName);

  let templateScript;
  if (fs.existsSync("script/reserve_core/cancel/" + engName)) {
    const tmpResult = ["javascript:(() => {"];
    const tmpCom = fs.readFileSync(
      "script/reserve_core/cancel/cancel_common.js",
      "utf-8"
    );
    /** dict */
    const conDict = fs.readFileSync(
      "script/reserve_core/cancel/" + engName + "/dict.json",
      "utf-8"
    );
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1] + '"', ar[2]].join(": "));
      });
      obj.push();
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDict);

    /** dictCourse */
    const conDictCourse = fs.readFileSync(
      "script/reserve_core/cancel/" + engName + "/dictCourse.json",
      "utf-8"
    );
    const reserve_course_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      Object.keys(json).forEach((key) => {
        obj.push(["  " + key, '"' + json[key].trim() + '"'].join(": "));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDictCourse);

    /** funcs */
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/cancel/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    if (!funcs.funcLogin) {
      if (fs.existsSync("script/reserve/cancel/" + engName + ".js")) {
        const oldFuncs = getFunc(
          fs.readFileSync("script/reserve/cancel/" + engName + ".js", "utf-8")
        );
        funcs.funcLogin = oldFuncs.funcLogin;
      } else {
        funcs.funcLogin = fs.readFileSync(
          "script/reserve_core/cancel/search_login.js",
          "utf-8"
        );
      }
    }
    tmpResult.push(tmpCom.dp({ address_mapping, reserve_course_mapping }));
    Object.keys(funcs).forEach((key) => {
      const func = funcs[key];
      tmpResult.push(func);
    });
    tmpResult.push("})();");
    templateScript = tmpResult.join("\r\n");
  } else {
    if (fs.existsSync("script/reserve/cancel/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/cancel/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve_core/cancel/template.js",
        "utf-8"
      );
  }
  const golfClubId = golfClubIds[engName];
  const script = templateScript.dp({
    golfClubId,
    commonScript,
    loginUrl,
    reserveUrl,
    loginScript,
  });
  return { url: reserveUrl, script };
}
function reserveSearchbotAdmin(data) {
  const { club: engName } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const reserveUrl = golfClubReserveUrl[engName];
  const loginScript = getPureLoginScript(engName);

  let templateScript;
  if (fs.existsSync("script/reserve_core/search/" + engName)) {
    const tmpResult = ["javascript:(() => {"];
    const tmpCom = fs.readFileSync(
      "script/reserve_core/search/search_common.js",
      "utf-8"
    );
    /** dict */
    const conDict = fs.readFileSync(
      "script/reserve_core/search/" + engName + "/dict.json",
      "utf-8"
    );
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1] + '"', ar[2]].join(": "));
      });
      obj.push();
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDict);

    /** dictCourse */
    const conDictCourse = fs.readFileSync(
      "script/reserve_core/search/" + engName + "/dictCourse.json",
      "utf-8"
    );
    const reserve_course_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      Object.keys(json).forEach((key) => {
        obj.push(["  " + key, '"' + json[key].trim() + '"'].join(": "));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDictCourse);

    /** funcs */
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/search/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    if (!funcs.funcLogin) {
      if (fs.existsSync("script/reserve/search/" + engName + ".js")) {
        const oldFuncs = getFunc(
          fs.readFileSync("script/reserve/search/" + engName + ".js", "utf-8")
        );
        funcs.funcLogin = oldFuncs.funcLogin;
      } else {
        funcs.funcLogin = fs.readFileSync(
          "script/reserve_core/search/search_login.js",
          "utf-8"
        );
      }
    }
    tmpResult.push(tmpCom.dp({ address_mapping, reserve_course_mapping }));
    Object.keys(funcs).forEach((key) => {
      const func = funcs[key];
      tmpResult.push(func);
    });
    tmpResult.push("})();");
    templateScript = tmpResult.join("\r\n");
  } else {
    if (fs.existsSync("script/reserve/search/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/search/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve_core/search/template.js",
        "utf-8"
      );
  }
  const golfClubId = golfClubIds[engName];
  const script = templateScript.dp({
    golfClubId,
    commonScript,
    loginUrl,
    reserveUrl,
    loginScript,
  });
  return { url: reserveUrl, script };
}
function reservebotAdmin(data) {
  const { club: engName, year, month, date, course, time } = data;
  const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const reserveUrl = golfClubReserveUrl[engName];
  const loginScript = getPureLoginScript(engName);

  let templateScript;
  if (fs.existsSync("script/reserve_core/reserve/" + engName)) {
    const tmpResult = ["javascript:(() => {"];
    const tmpCom = fs.readFileSync(
      "script/reserve_core/reserve/reserve_common.js",
      "utf-8"
    );
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1] + '"', ar[2]].join(": "));
      });
      obj.push();
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/dict.json",
        "utf-8"
      )
    );
    const reserve_course_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      Object.keys(json).forEach((key) => {
        obj.push(["  " + key, '"' + json[key].trim() + '"'].join(": "));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/dictCourse.json",
        "utf-8"
      )
    );
    const splitter_date = fs.readFileSync(
      "script/reserve_core/reserve/" + engName + "/splitterDate",
      "utf-8"
    );
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    if (!funcs.funcLogin) {
      if (fs.existsSync("script/reserve/reserve/" + engName + ".js")) {
        const oldFuncs = getFunc(
          fs.readFileSync("script/reserve/reserve/" + engName + ".js", "utf-8")
        );
        funcs.funcLogin = oldFuncs.funcLogin;
      } else {
        funcs.funcLogin = fs.readFileSync(
          "script/reserve_core/reserve/reserve_login.js",
          "utf-8"
        );
      }
    }
    tmpResult.push(
      tmpCom.dp({ address_mapping, reserve_course_mapping, splitter_date })
    );
    Object.keys(funcs).forEach((key) => {
      const func = funcs[key];
      tmpResult.push(func);
    });
    tmpResult.push("})();");
    templateScript = tmpResult.join("\r\n");
  } else {
    if (fs.existsSync("script/reserve/reserve/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/reserve/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve_core/reserve/template.js",
        "utf-8"
      );
  }
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
  return { url: loginUrl, script };
}
function searchbotTime(data) {
  const { club: engName, command, date: TARGET_DATE } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const loginScript = getLoginScript(engName, true);
  const templateScript = fs.readFileSync("template.js", "utf-8");
  const searchScript = getSearchScript(engName, command).dp({ TARGET_DATE });
  const script = templateScript.dp({
    commonScript,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: loginUrl,
    script,
  };

  return objResp;
}
function searchbotTimeAdmin(data) {
  const { club, command, date: TARGET_DATE } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[club];
  const searchUrl = golfClubSearchUrl[club];
  const loginScript = gf("script/login/" + club + ".js")
    .split("\r\n")
    .join("\r\n    ");
  // step 2: url 정보
  const urls = ("script/search_dict/" + club + ".json").gfjp();
  const objUrl = [];
  urls.forEach(([, url, func]) => {
    if (
      [
        "funcLogin",
        "funcSearch",
        "funcReserve",
        "funcCalendar",
        "funcOut",
        "funcLogout",
        "funcProcEnd",
        "funcPopLogin",
        "funcMain",
        "funcMove",
      ].indexOf(func) == -1
    )
      return;
    objUrl.push('"' + url + '": ' + func);
  });
  const address_mapping = "{" + objUrl.join(",") + "}";
  const templateScript = gf("template/search/template.js");
  let { searchCommonScript, searchScript } = getSearchScriptAdmin(
    club,
    command
  );
  searchCommonScript = searchCommonScript.dp({ TARGET_DATE });
  const script = templateScript.dp({
    commonScript,
    searchCommonScript,
    address_mapping,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: searchUrl,
    script,
  };

  return objResp;
}
function searchbotDateAdmin(data) {
  const { club, command } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[club];
  const searchUrl = golfClubSearchUrl[club];
  const loginScript = gf("script/login/" + club + ".js")
    .split("\r\n")
    .join("\r\n    ");
  // step 2: url 정보
  const urls = ("script/search_dict/" + club + ".json").gfjp();
  const objUrl = [];
  urls.forEach(([, url, func]) => {
    if (
      [
        "funcLogin",
        "funcSearch",
        "funcReserve",
        "funcCalendar",
        "funcOut",
        "funcLogout",
        "funcProcEnd",
        "funcPopLogin",
        "funcMain",
        "funcMove",
      ].indexOf(func) == -1
    )
      return;
    objUrl.push('"' + url + '": ' + func);
  });
  const address_mapping = "{" + objUrl.join(",") + "}";
  const templateScript = gf("template/search/template.js");
  const { searchCommonScript, searchScript } = getSearchScriptAdmin(
    club,
    command
  );
  const script = templateScript.dp({
    commonScript,
    searchCommonScript,
    address_mapping,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: searchUrl,
    script,
  };

  return objResp;
}
function searchbotDate(data) {
  const engName = data.club;
  const command = data.command;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const loginScript = getLoginScript(engName, true);
  const templateScript = fs.readFileSync("template.js", "utf-8");
  const searchScript = getSearchScript(engName, command);
  const script = templateScript.dp({
    commonScript,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: loginUrl,
    script,
  };

  return objResp;
}
function searchbot(data) {
  const engName = data.club;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const loginScript = getLoginScript(engName, true);
  const templateScript = fs.readFileSync("template.js", "utf-8");
  const searchScript = getSearchScript(engName);
  const script = templateScript.dp({
    commonScript,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: loginUrl,
    script,
  };

  return objResp;

  /* const engName = data.club;
    const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const searchUrl = golfClubSearchUrl[engName];
    const loginScript = getPureLoginScript(engName);
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1], ar[2]].join('": '));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/dict.json",
        "utf-8"
      )
    );
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    const endoutScript = [funcs.funcEnd, funcs.LOGOUT].join("\r\n");
    const templateScript = fs.readFileSync("template.js", "utf-8");
    getSearchScript(engName, (searchScript) => {
      const script = templateScript.dp({
        commonScript,
        loginUrl,
        searchUrl,
        loginScript,
        searchScript,
        address_mapping,
        endoutScript,
      });
      objResp = {
        url: loginUrl,
        script,
      };
      callback(objResp);    
    }); */
}
function getFunc(code) {
  code = code.split("\r\n").join("\n");
  code = code.split("\n").join("\r\n");
  let pCount = 0;
  const funcs = {};
  const resEls = [];
  let curFunc = "";
  code.split("\r\n").forEach((ln) => {
    const regex = /\s?function\s([a-zA-Z]+)\s?\(/;
    const res = regex.exec(ln);
    if (!pCount && res) {
      curFunc = res[1];
      funcs[curFunc] = [ln];

      let plus = ln.howmany("{");
      let minus = ln.howmany("}");

      pCount += plus - minus;

      return;
    }
    if (pCount) {
      funcs[curFunc].push(ln);

      let plus = ln.howmany("{");
      let minus = ln.howmany("}");

      pCount += plus - minus;
      return;
    }
    resEls.push(ln);
  });
  Object.keys(funcs).forEach((key) => {
    const func = funcs[key];
    funcs[key] = func.join("\r\n");
  });
  return funcs;
}
function getClubs(callback) {
  /* const connection = mysql.createConnection(
      JSON.parse(fs.readFileSync("db.json", "utf-8"))
    );
    connection.connect();
    connection.query(
      fs.readFileSync("sql/getSearchClubs.sql", "utf-8"),
      (err, rows, fields) => {
        callback(rows);
      }
    );
    connection.end(); */
  "sql/getSearchClubs.sql".gf().query((err, rows, fields) => {
    if (err) callback(err);
    else callback(rows);
  });
}
function controlForUserDevice(engName, token) {
  token =
    "dybWCsvWR1KXBSlgTU1ocg:APA91bGM8fzGQy3c9shE4ZKywouYAD-ZYRZDJjgA60U4tOV7HeQyNJW01nTUi5bIf2B_dkVXtRBv75HpTrg70UnX0DurwwvWckOLyZzrmt5Kk5MIiluUfDX0O1M1fo2CegVNlqzirWp8";
  console.log(token);
  const message = {
    data: {
      command: "search",
      club: engName,
      club_id: golfClubIds[engName],
    },
    // topic: "search",
    token,
  };
  console.log(message);
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
function controlForAdminDevice(engName) {
  const message = {
    data: {
      command: "search",
      club: engName,
      club_id: golfClubIds[engName],
    },
    topic: "admin",
    // token,
  };
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
function getSearchScriptAdmin(engName, command) {
  if (!command) command = "NORMAL";
  const golfClubId = golfClubIds[engName];
  const param = {
    golf_club_id: "",
    golf_course: [],
    command,
  };
  // step 1: course 정보
  golfCourseByEngId[engName].forEach((course, i) => {
    if (i === 0) param.golf_club_id = course.golf_club_id;
    param.golf_course.push(
      [
        "'" + course.golf_course_name + "'",
        ": '",
        course.golf_course_id,
        "',",
      ].join("")
    );
  });
  param.golf_course = param.golf_course.join("\r\n\t");

  // step 2: 공통 변수 및 함수
  const path = "template/search/";
  const mneCallCommon = (path + "mneCallCommon.js").gf();
  const a = (path + "search_common.js").gf();
  const b = (path + "search_common2.js").gf();
  const c = (path + "search_function.js").gf();
  const cores = ("script/search_core/" + engName + ".js")
    .gf()
    .split("/* <============line_div==========> */");
  const core = cores.pop();
  const d = cores.join("").dp({ mneCallCommon });

  // LOGOUT
  const loPath = "script/search_logout/" + engName + ".json";
  let { LOGOUT } = loPath.gfjp();
  const searchCommonScript = a.add(b).add(c).add(d).add(LOGOUT).dp(param);

  // step 3: 동작 함수
  const addr = "script/search_wrapper/" + engName + ".js";
  const chk = fs.existsSync(addr);
  let wrapper;
  let script;
  if (chk) {
    wrapper = addr.gf();
    script = wrapper.dp({ searchScript: core });
  } else {
    script = core;
  }
  const searchScript = script.dp({ golfClubId });

  return { searchCommonScript, searchScript };
}
function getSearchScript(engName, command) {
  if (!command) command = "NORMAL";
  const golfClubId = golfClubIds[engName];
  const param = {
    golf_club_id: "",
    golf_course: [],
    command,
  };
  log("course", engName, golfCourseByEngId[engName]);
  golfCourseByEngId[engName].forEach((course, i) => {
    if (i === 0) param.golf_club_id = course.golf_club_id;
    param.golf_course.push(
      [
        "'" + course.golf_course_name + "'",
        ": '",
        course.golf_course_id,
        "',",
      ].join("")
    );
  });
  param.golf_course = param.golf_course.join("\r\n\t");
  const template = gf("search_template.js").dp(param);
  const common = gf("search_template2.js").add(gf("search_template3.js"));
  const core = gf("script/search_core/" + engName + ".js");
  let wrapper;
  try {
    wrapper = gf("script/search_wrapper/" + engName + ".js");
  } catch (e) {
    console.log(e.toString());
  }

  let script;
  if (wrapper) script = wrapper.dp({ searchScript: template + common + core });
  else script = template + common + core;

  return script.dp({ golfClubId });
}
function getLinkLoginScript(engName) {
  const golfClubId = engName;
  const path = "template/login/";
  const cover = gf(path + "cover.template");
  const template = gf(path + "login.template");
  const common = "script/common/common.js".gfdp(ENV);
  const chk = fs.existsSync("script/link/login/" + engName + ".js");
  if (!chk) return "";

  let loginScript = gf("script/link/login/" + engName + ".js");
  loginScript = loginScript.split("\r\n").join("\r\n    ");
  let loginContent = template.dp({ common, loginScript, golfClubId });
  loginContent = cover.dp({ loginContent });

  return loginContent;
}
function getPureLoginScript(engName) {
  const golfClubId = golfClubIds[engName];
  const cover = fs.readFileSync("template/login/cover.template", "utf-8");
  const template = fs.readFileSync("template/login/login.template", "utf-8");
  const common = "";
  let loginScript;
  let loginContent;
  try {
    loginScript = fs
      .readFileSync("script/login/" + engName + ".js", "utf-8")
      .split("\r\n")
      .join("\r\n    ");
    loginContent = template.dp({ common, loginScript, golfClubId });
  } catch (e) {
    loginContent = "no login script";
  }
  return loginContent;
}
function getLoginScriptAdmin(engName) {
  const golfClubId = golfClubIds[engName];
  const path = "template/login/";
  const cover = gf(path + "cover.template");
  const template = gf(path + "login.template");
  const common = "script/common/common.js".gfdp(ENV);
  const chk = fs.existsSync("script/login/" + engName + ".js");
  if (!chk) return "";

  let loginScript = gf("script/login/" + engName + ".js");
  loginScript = loginScript.split("\r\n").join("\r\n    ");
  let loginContent = template.dp({ common, loginScript, golfClubId });
  loginContent = cover.dp({ loginContent });

  return loginContent;
}
function getLoginScript(engName, noCover) {
  const golfClubId = golfClubIds[engName];
  const cover = "template/login/cover.template".gf();
  const template = "template/login/login.template".gf();
  const common = "script/common/common.js".gfdp(ENV);
  let loginScript;
  let loginContent;
  try {
    loginScript = ("script/login/" + engName + ".js")
      .gf()
      .split("\r\n")
      .join("\r\n    ");
    loginContent = template.dp({ common, loginScript, golfClubId });
    log("noCover", noCover);
    if (noCover == undefined) loginContent = cover.dp({ loginContent });
  } catch (e) {
    loginContent = "no login script";
  }
  return loginContent;
}
function gf(file) {
  //get file
  return fs.readFileSync(file, "utf-8");
}
