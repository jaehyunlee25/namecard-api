javascript: (() => {
  ${commonScript}
  const addr = location.href.split("?")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "http://www.acrogolf.co.kr/mobile/index.asp": funcEnd,
  };
  const func = dict[addr];
  if (func) func();
  if (!func) location.href = "${reserveUrl}";
  function funcLogin() {
    ${loginScript}
  }
  function funcEnd() {
    const ac = window.AndroidController;
    if (ac) ac.message("end of reserve/cancel");
  }
  function funcReserve() {
    const els = document
      .getElementsByClassName("typeA text-center")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("a");
    const result = [];
    const dictCourse = {
      1: "챌린지",
      2: "마스터",
      3: "스카이",
    };
    Array.from(els).forEach((el) => {
      const [btnDate, , btnCourse, btnTime] = el.getAttribute("onclick").inparen();
      console.log("reserve search", dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
      const param = {
        golf_club_id: "${golfClubId}",
        result,
      };
      const fulldate = [year, month, date].join("");
      if (
        btnDate == fulldate &&
        btnCourse == dictCourse[course] &&
        btnTime == time
        )
        target = btn;
      });
      if (target) {
        target.click();
        reservation_cancel_ok();
      }
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
        location.href = "logout.asp";
      });
    });
  }
})();