function mneCall(date, callback) {
  intvEl = doc.gcn("calendar_cont").length > 0;
  ${mneCallCommon}
  function exec() {
    const param = {
      day: date.gh(4) + "/" + date.gt(2) + "/01",
      type: "today",
      change_day: "",
    };
    post("Booking/AjaxCalendar", param, {}, (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;
  
      const els = ifr.getElementsByTagName("td");
      Array.from(els).forEach((el) => {
        if (el.className !== "wait ") return;
  
        const date = el.getAttribute("data-day");
        dates.push([date, 0]);
      });
      callback();
    });
  }
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    day: date,
    change_day: "",
  };
  post("Booking/AjaxGetTime", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.getElementsByTagName("li");
    const dictCourse = { 11: "EAST", 22: "WEST" };
    const obTeams = {};
    Array.from(els).forEach((el, i) => {
      const course = dictCourse[el.getAttribute("data-course")];
      const time = addColon(el.getAttribute("data-time"));
      const fee_discount = el.getAttribute("data-fee") * 1;
      const fee_normal = el.getAttribute("data-ori") * 1;
      const slot = time.gh(2);

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

function addColon(str) {
  return str.gh(2) + ":" + str.gt(2);
}

/* <============line_div==========> */

mneCall(thisdate, () => {
  change_calendar(thisdate, "next");
  mneCall(nextdate, procDate);
});
