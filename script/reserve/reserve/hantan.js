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
  let addr = location.href.split("?")[0];
  if(addr.indexOf("#") != -1) addr = addr.split("#")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://m.hantancc.co.kr/": funcMain,
    "https://m.hantancc.co.kr/m/logout.asp": funcOut,
    "https://booking.hantancc.co.kr/m/reservation_05.asp": funcList,
    "https://booking.hantancc.co.kr/m/reservation_01_2.asp": funcExec,
    "https://booking.hantancc.co.kr/m/reservation_01_3.asp": LOGOUT,
  };
  log("raw addr :: ", location.href);
  log("addr :: ", addr);
  const func = dict[addr];
  const dictCourse = {
    VALLEY: "1",
    MOUNTAIN: "2",
  };
  const fulldate = [year, month, date].join("");
  log(addr);
  if (!func) funcMain();
  else func();

  function funcList() {
    log("funcList");
    LOGOUT();
    return;
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;    
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    log("funcLogin");
    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    const suffix = location.href.split("#")[1];
    if(suffix && suffix == "go_focus") {
      const tag = localStorage.getItem("TZ_FOCUS");
      if (tag && new Date().getTime() - tag < 1000 * 5) {
        funcEnd();
        return;
      }
      localStorage.setItem("TZ_FOCUS", new Date().getTime());

      funcTime();
      return;
    }

    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {      
      Date_Click(fulldate, fulldate.ct(2));
    });
  }
  function funcTime() {
    log("funcTime");

    const tag = localStorage.getItem("TZ_TIME");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_TIME", new Date().getTime());

    const els = doc.gtn("a");
    log("els", els, els.length);

    let target;
    els.every(el => {
      const href = el.attr("href");
      if(!href || href.indexOf("JavaScript:Book_time(") == -1) return true;
      
      const param = href.inparen();
      const [elDate, elTime, elCourse] = param;
      const sign = dictCourse[course];

      log(elDate == fulldate, elTime == time, elCourse == sign);
      log(elDate, fulldate, elTime, time, elCourse, sign);
      if(elDate == fulldate && elTime == time && elCourse == sign) target = el;

      return !target;
    });

    log("target", target);
    if(target) target.click();
    else LOGOUT();
  }
  function funcExec() {
    log("funcExec");

    const tag = localStorage.getItem("TZ_EXEC");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_EXEC", new Date().getTime());

    timer(1000, () => {
      doc.gcn("btns")[0].gtn("button")[0].click();
    });
    return;
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
    log("LOGOUT");
    location.href = "/m/logout.asp";
  }
})();
