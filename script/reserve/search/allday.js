javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/reserve",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/search",
    parameter: JSON.stringify({}),
  };
  const addr = location.href.split("?")[0];
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    if (coPlace.innerText != "앙성면") {
      changeCoDiv("76");
    }    
    TZLOG(logParam, (data) => {
      setTimeout(funcSearch, 3000);
    });
  }
  function funcSearch() {
    const els = window["time-grid"].children;
    const result = [];
    const dictCourse = {
      M: "Mountain",
      V: "Valley",
      L: "Lake",
    };
    Array.from(els).forEach((el) => {
      const date = "20" + el.children[0].innerText.split("/").join("");
      const time = el.children[1].innerText.split(":").join("");
      const course = el.children[2].innerText;
      console.log("reserve search", dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
    });
    const param = {
      golf_club_id: "${golfClubId}",
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
        doLogout();
        const ac = window.AndroidController;
        if (ac) ac.message("end of reserve/search");
      });
    });
  }
})();
