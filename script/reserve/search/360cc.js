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
  const addr = location.href.split("?")[0];
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "http://www.360cc.co.kr/mobile/main/mainPage.do": funcEnd,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  if (func) func();
  if (!func) location.href = "${reserveUrl}";
  function funcLogin() {
    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcEnd() {
    const ac = window.AndroidController;
    if (ac) ac.message("end of reserve/search");
  }
  function funcReserve() {
    const els = document
      .getElementsByClassName("cm_time_list_tbl")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    const result = [];
    const dictCourse = {
      OUT: "Out",
      IN: "IN",
    };
    Array.from(els).forEach((el) => {
      const [time, , date, , , course] = el.children[3].children[0]
        .getAttribute("onclick")
        .inparen();
      console.log("reserve search", dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      device_id: "${deviceId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      console.log(data);
      const param = {
        type: "command",
        sub_type: "reserve/search",
        device_id: "${deviceId}",
        device_token: "${deviceToken}",
        golf_club_id: "${golfClubId}",
        message: "end of reserve/search",
        parameter: JSON.stringify({}),
      };
      TZLOG(param, (data) => {
        log(data);
      });

      window["mm-m0-p0"].getElementsByTagName("a")[1].click();
    });
  }
})();
