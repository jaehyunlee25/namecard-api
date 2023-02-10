function mneCall(date, callback) {
  const param = {
    golfId: "P1",
    siteid: "11",
    curDate: (date + "01").datify(),
    mobile: "mobile",
  };
  post("/IRS/golf/golfavailablelist.do", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = doc.gba(attr, "javascript:movetoStep2(", true);
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
  const [date, sign] = arrDate;
  const addr = "/IRS/mobile/golfstep2.do";
  const method = "post";
  const param = {
    useApp: "N",
    siteid: "11",
    siteDesc: "용평리조트",
    golfId: "P1",
    golfDesc: "용평9",
    selectedMemno: "",
    selectedDate: date,
    errorCode: "",
    enableDate: "",
  };
  const dictCourse = {
    1: "단일",
  };
  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "name";
    const els = ifr.gba(attr, "chTime", true);
    Array.from(els).forEach((el, i) => {
      if (i == 0) return;
      const course = dictCourse[1];
      const time = el.value.rm(":");
      let fee_normal = el.nm(1).gba(attr, "normalcyAmt", true)[0].value * 1;
      let fee_discount = el.nm(1).gba(attr, "internetAmt", true)[0].value * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "9홀",
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
