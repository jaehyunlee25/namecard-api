function mneCall(date, callback) {
  const param = {
    clickTdId: "",
    clickTdClass: "",
    workMonth: date,
    workDate: date + "01",
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "",
    searchTime: "",
    selfTYn: "",
    temp001: "",
    bookgComment: "",
    memberCd: "80",
    temp007: "",
    agencyReservationYn: "N",
    certSeq: "",
    foulMsg: "",
    agencyBookgName: "",
    agencyHp1: "010",
    agencyHp2: "",
    agencyHp3: "",
    agreeYn: "Y",
  };
  post("/reservation/ajax/golfCalendar", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const attr = "onclick";
    const els = ifr.gba(attr, "clickCal", true);
    Array.from(els).forEach((el) => {
      const [, sign, date, opt] = el.attr(attr).inparen();
      if (opt != "OPEN") return;
      dates.push([date, sign]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/reservation/ajax/golfTimeList";
  const method = "post";
  const param = {
    clickTdId: "A" + date,
    clickTdClass: sign,
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    selfTYn: "",
    temp001: "",
    bookgComment: "",
    memberCd: "80",
    temp007: "",
    agencyReservationYn: "N",
    certSeq: "",
    foulMsg: "",
    agencyBookgName: "",
    agencyHp1: "010",
    agencyHp2: "",
    agencyHp3: "",
    agreeYn: "Y",
  };
  const dictCourse = {
    1: "Ace",
    2: "Dream",
    3: "Challenge",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "golfConfirm", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, , , hole, fee] = el.attr(attr).inparen(true);
      hole = hole.ct(1);
      course = dictCourse[course];
      const fee_normal = fee.rm(",") * 1;
      const fee_discount = fee.rm(",") * 1;

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