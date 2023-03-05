function mneCall(date, callback) {
  EXTZLOG("search", "mneCall");
  let count = 0;
  const mneT = setInterval(funcInterval, INTV_TIME);
  const intvEl = doc.gcn("month1").length == 2;
  const logPrm = { LOGID, step: "mneCall_interval" };
  function funcInterval() {
    if (!intvEl) {
      EXTZLOG("search", ["interval count", count].join(", "), logPrm);
      count++;
      if (count > INTV_COUNT) {
        EXTZLOG("search", ["interval count out", count].join(", "), logPrm);
        clearInterval(mneT);
        callback();
      }
      return;
    }
    clearInterval(mneT);
    exec();
  }
  function exec() {
    const res = {};
    let els = doc.gcn("valid");
    Array.from(els).forEach((el, i) => {
      if (el.children.length == 0) return;
      const time = el.attr("time") * 1;
      const day = new Date(time);
      const year = day.getFullYear();
      const month = (day.getMonth() + 1 + "").addzero();
      const dt = (day.getDate() + "").addzero();
      res[[year, month, dt].join("")] = true;
    });
    doc.gcn("btn_calendar_next")[0].click();
    els = doc.gcn("valid");
    Array.from(els).forEach((el, i) => {
      if (el.children.length == 0) return;
      const time = el.attr("time") * 1;
      const day = new Date(time);
      const year = day.getFullYear();
      const month = (day.getMonth() + 1 + "").addzero();
      const dt = (day.getDate() + "").addzero();
      res[[year, month, dt].join("")] = true;
    });
    Object.keys(res).forEach((date) => {
      dates.push([date, ""]);
    });
    doc.gcn("btn_calendar_next")[0].click();
    els = doc.gcn("valid");
    Array.from(els).forEach((el, i) => {
      if (el.children.length == 0) return;
      const time = el.attr("time") * 1;
      const day = new Date(time);
      const year = day.getFullYear();
      const month = (day.getMonth() + 1 + "").addzero();
      const dt = (day.getDate() + "").addzero();
      res[[year, month, dt].join("")] = true;
    });
    EXTZLOG("search", Object.keys(res).length);
    const distinct = {};
    Object.keys(res).forEach((date) => {
      if (distinct[date]) return;
      distinct[date] = true;
      EXTZLOG("search", date);
      dates.push([date, ""]);
    });
    callback();
  }
}

/* <============line_div==========> */
const distinct = {};
function mneCallDetail(arrDate) {
  EXTZLOG("mneCall", "start");
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/global/reservation/ajax/ajax_real_timeinfo_list";
  const method = "post";
  const param = {
    companyCd: "J08",
    bookgDate: date,
    bookgCourse: "0",
    courseId: "0",
    bookgTime: "",
    cmd: "",
    cmKind: "",
    atype: "",
    bookgNo: "",
    bookgCnt: "4",
    email: "",
    gubun: "BOOKG",
    gcGubun: "G",
    pkgCode: "",
    pkgGubun: "02",
    pkgName: "",
    pkgGolfAmt: "",
    pkgGolfCnt: "",
    pkgStoreAmt: "",
    pkgTotAmt: "",
    bookgGreenFee: "",
    birthDay: "",
    sexCd: "",
    memberName: "",
    pNationCd: "",
    noMemberHandTel: "",
    userDi: "",
    userCi: "",
    ssnKind: "",
    oldCompanyCd: "",
    oldBookgCourse: "",
    oldBookgTime: "",
    oldBookgDate: "",
    oldBookgNo: "",
    oldBookgSeq: "0",
    oldGubun: "",
    oldGcGubun: "",
    stateGubun: "",
    memberNo: "99993468",
    selfRyn: "",
    selfCyn: "",
  };
  const dictCourse = {
    1: "오동도",
    2: "돌산도",
    3: "금오도",
  };

  fCall[method](addr, param, {}, (data) => {
    EXTZLOG("mneCall", "ajax callback");
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "golfTimeSelect", true);
    Array.from(els).forEach((el) => {
      let [date, , time, fee, course] = el.attr("onclick").inparen(true);
      time = time.trim();
      date = date.rm(".");
      course = dictCourse[course.trim()];
      const hole = 18;
      fee_normal = fee.rm(",") * 1;
      fee_discount = fee.rm(",") * 1;

      if (distinct[date + time + course]) return;
      distinct[date + time + course] = true;

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
    EXTZLOG("mneCall", "golf_schedule count : " + golf_schedule.length);
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
