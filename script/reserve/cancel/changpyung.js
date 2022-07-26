javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/cancel",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/cancel",
    parameter: JSON.stringify({}),
  };
  const addr = location.href.split("?")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const mCourse = "${course}";
  const time = "${time}";
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "https://m.cppc.co.kr/_html/member/logout_ok.asp": funcOut,
  };
  const func = dict[addr];

  if (!func) funcOther();
  else func();

  function funcOut() {
    log("funcOut");
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_OTHER", new Date().getTime());

    location.href = "${reserveUrl}";
  }
  function funcLogin() {
    log("funcLogin");
    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {});
    timer(1000, funcCancel);
  }
  function funcCancel() {
    log("funcCancel");

    const els = doc.gtn("tbody")[0].gtn("tr");
    log("els", els, els.length);

    const dictCourse = {
      11: "단일",
    };
    let target;
    Array.from(els).every((el) => {
      const param = el.children;
      const elDate = param[1].str().rm("-");
      const elTime = param[2].str().rm(":");
      const elCourse = "11";
      log("reserve cancel", dictCourse[elCourse], elDate, elTime);

      const fulldate = [year, month, date].join("");
      log(elDate == fulldate, dictCourse[elCourse] == mCourse, elTime == time);
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == mCourse &&
        elTime == time
      )
        target = param[6].children[0];
      
      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
    } else {
      funcEnd();
    }
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/Logout";
  }
})();
