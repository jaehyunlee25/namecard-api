function mneCall(date, callback) {
  const dt = (date + "01").datify("/");
  const param = {
    day: dt,
    type: "today",
    rsv_gubun: "P",
  };
  post("/Mobile/Ajax/MobilePublicCalendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "onclick";
    const els = ifr.gba(attr, "reservation(", true);
    Array.from(els).forEach((el) => {
      const [fulldate] = el.attr(attr).inparen();
      dates.push([fulldate, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Mobile/Booking/SelectPublicTime";
  const method = "post";
  const param = {
    date: date,
    rsv_gubun: "P",
  };
  const dictCourse = {
    와이트혼: "와이트혼",
    빅토리아파크: "빅토리아파크",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "ReservationForm(", true);
    Array.from(els).forEach((el) => {
      const time = el.nm(2, 0).str().rm(":");
      const course = el.nm(2, 1).str();
      const hole = el.nm(2, 2).str().trim().ct(1);
      fee_normal = 60000;
      fee_discount = 60000;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole + "홀",
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
