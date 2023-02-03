function mneCall(date, callback) {
  const compSign = "J55";
  const param = {
    companyCd: "",
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
    temp007: "",
    certSeq: "",
    selectTime: "",
    payGubun: "",
    payAmt: "",
    eventYn: "",
    eventGubun: "",
    cponYn: "",
    eventYn: "",
    tabSessionId: "",
    joinYn: "",
    flagCd: "",
    cartAvlYn: "",
    timeOpenYn: "N",
    companyOpenYn: "N",
    selCompany: compSign,
    delegYn: "",
    agencyReservationYn: "",
    selectMember: selectMember.value,
    selectCompany: compSign,
    agencyBookgName: "",
    agencyHp1: "010",
    agencyHp2: "",
    agencyHp3: "",
    certNoChk: "",
  };
  post("/reservation/ajax/golfCalendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "clickCal(", true);
    Array.from(els).forEach((el) => {
      const [sign, gb, fulldate, opt] = el.attr(attr).split(";")[0].inparen();
      if (opt != "OPEN") return;
      dates.push([fulldate, sign, gb]);
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
  const compSign = "J55";
  const param = {
    companyCd: "",
    clickTdId: "A" + date,
    clickTdClass: "",
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    selfTYn: "",
    temp001: "",
    bookgComment: "",
    temp007: "",
    certSeq: "",
    selectTime: "",
    payGubun: "",
    payAmt: "",
    eventYn: "",
    eventGubun: "",
    cponYn: "",
    eventYn: "",
    tabSessionId: "",
    joinYn: "",
    flagCd: "",
    cartAvlYn: "",
    timeOpenYn: "N",
    companyOpenYn: "N",
    selCompany: compSign,
    delegYn: "",
    agencyReservationYn: "",
    selectMember: selectMember.value,
    selectCompany: compSign,
    agencyBookgName: "",
    agencyHp1: "010",
    agencyHp2: "",
    agencyHp3: "",
    certNoChk: "",
  };
  const dictCourse = {
    2: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "golfConfirm(", true);
    Array.from(els).forEach((el) => {
      let [, , date, time, course, , , hole, fee_normal, fee_discount] = el
        .attr(attr)
        .replace(/\s/g, "")
        .inparen(true);
      course = dictCourse[course];
      hole = hole.ct(1);
      fee_normal = fee_normal.rm(",") * 1;
      fee_discount = fee_discount.rm(",") * 1;

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
