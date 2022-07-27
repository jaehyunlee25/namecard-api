javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/reserve",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/reserve",
    parameter: JSON.stringify({}),
  };
  const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
  const addr = location.href.split(splitter)[0];
  const suffix = location.href.split(splitter)[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "http://kugolf.co.kr/_mobile/index.asp": funcMain,
    "http://kugolf.co.kr/_mobile/login/logout.asp": funcOut,
    "http://kugolf.co.kr/_mobile/GolfRes/onepage/my_golfreslist.asp":
      LOGOUT,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    미쁨: "2",
    바른: "1",
    혼솔: "3",
  };
  const fulldate = [year, month, date].join("");

  if (!func) funcOther();
  else func();

  function funcMain() {
    log("funcMain");
    if(lsg("TZ_ABSOLUTE_LOGOUT") == "true") {

      location.href = "${searchUrl}";
      lsr("TZ_ABSOLUTE_LOGOUT");

    } else {

      const tag = lsg("TZ_MAIN");
      if (tag && new Date().getTime() - tag < 1000 * 5) return;
      lss("TZ_MAIN", new Date().getTime());

      log(doc.gcn("hi_ment")[0].str());
      lss("TZ_ABSOLUTE_LOGOUT", "true");
      LOGOUT();
    }
  }
  function funcOut() {
    log("funcOut");
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    if(addr.indexOf("returnurl") != -1) {
        lss("TZ_RETURN", "true");
        funcLogin();
    } else {
      location.href = "${searchUrl}";
    }
  }
  function funcLogin() {
    log("funcLogin");

    if(lsg("TZ_RETURN") == "true") {
      log("TZ_RETURN");
      lsr("TZ_RETURN");
    } else {
      const tag = localStorage.getItem("TZ_LOGIN");
      if (tag && new Date().getTime() - tag < 1000 * 5) return;
      localStorage.setItem("TZ_LOGIN", new Date().getTime());
    }

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    if (!suffix) return;

    const suffixParam = (() => {
      const result = {};
      suffix.split("&").forEach((item) => {
        const dv = item.split("=");
        result[dv[0]] = dv[1];
      });
      return result;
    })();

    log("settype", suffixParam["settype"]);
    if (suffixParam["settype"] == "") {
      log("calendar");
      funcDate();
    } else if (suffixParam["settype"] == "T") {
      log("time");
      funcTime();
    } else {
      return;
    }
  }
  function funcDate() {
    log("funcDate");
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      let sign = fulldate.daySign();
      if (sign != 1) sign = 2;
      timefrom_change(fulldate, sign, fulldate.dayNum(), "", "00", "T");
    });
  }
  function funcTime() {
    log("funcTime");
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    const els = doc.gcn("cm_btn default");
    let target;
    els.every((el) => {
      const param = el.attr("onclick").inparen();
      const [, elCourse, elTime] = param;
      const sign = dictCourse[course];
      log(elCourse, sign, elTime, time);
      log(elCourse == sign, elTime == time);
      if (elCourse == sign && elTime == time) target = el;

      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
      timer(1000, funcExec);
    } else {
      LOGOUT();
    }
  }
  function funcExec() {
    log("funcExec");
    document.gcn("cm_btn default")[0].click();
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    location.href = "/_mobile/login/logout.asp";
  }
})();
