function mneCall(date, callback) {
  const param = {
    day: (date + "01").datify("/"),
    type: "",
    changeDate: "",
    changeSeq: "",
  };
  post("/Reservation/AjaxCalendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "data-day";
    const els = ifr.gba(attr, "", true);
    Array.from(els).forEach((el) => {
      const fulldate = el.attr(attr);
      dates.push([fulldate, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, option] = arrDate;
  const addr = "/Reservation/AjaxTimeList";
  const method = "post";
  const param = {
    date: date,
    changeDate: "",
    changeSeq: "",
    course: "",
  };
  const dictCourse = {
    이지: "Easy",
    스카이: "Sky",
  };
  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "javascript:formLayer(", true);
    Array.from(els).forEach((el, i) => {
      const [date] = el.attr(attr).inparen();
      const course = dictCourse[el.nm(2, 0).str()];
      const time = el.nm(2, 1).str().split("/")[1].trim().rm(":");
      const hole = el.nm(2, 2).str().ct(1);
      const fee_normal = el.nm(2, 3).str().trim().rm(",") * 1;
      const fee_discount = el.nm(2, 4).str().trim().rm(",") * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "18홀",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
