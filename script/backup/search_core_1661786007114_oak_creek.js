function mneCall(date, callback) {
  log("mneCall");

  const param = {
    V_IN_GOLF_ID: "P1",
    V_IN_YEAR: date.gh(4),
    V_IN_MONTH: date.gt(2),
    V_IN_COURSE: "F",
  };
  post("/golf.calendar.pns?getCalendar", param, {}, (data) => {
    const els = JSON.parse(data).entitys;
    Array.from(els).forEach((el) => {
      if (el.IT_OPEN_DESC != "신청하기") return;
      const fulldate = el.ORI_CD_DATE.split("-").join("");
      dates.push([fulldate, 0]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const dictCourse = {
    F: "단일",
  };
  const arr = ["F"];

  exec();

  function exec() {
    const courseCode = arr.shift();
    if (!courseCode) {
      procDate();
      return;
    }

    const param = {
      V_IN_GOLF_ID: "P1",
      V_IN_DATE: date.datify(),
      V_IN_COURSE: courseCode,
      V_IN_ROUND_TYPE: "",
      ID_REF_CD: "",
      V_IN_MEMNO: "",
    };
    post("/golf.course.pns?getCourse_All", param, {}, (data) => {
      const els = JSON.parse(data).entitys;
      Array.from(els).forEach((el) => {
        const time = el.r_TIME.rm(":");
        const course = dictCourse[courseCode];
        fee_discount = el.ACT_GREENFEE * 1;
        fee_normal = el.STD_GREENFEE * 1;

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
      exec();
    });
  }
}

/* <============line_div==========> */
function funcCalendar() {
  log("funcCalendar");
  log(document.body.innerHTML);
  if(window["popup_message"]) {
    if(popup_message.str().indexOf("세션이 종료") != -1) {
      popup_ok.click();
      return;
    }
  }  
  P1.click();
}
function funcLogout() {
  log("funcLogout");
  location.href = '/oak_new/login_exec.asp?logout=y';
}
function funcProcEnd() {
  log("funcEnd");
  return;
}
function funcPopLogin() {
  log("funcPopLogin");
  V_IN_CYBER_ID.value = "${login_id}";
  V_IN_CYBER_PASS.value = "${login_password}";
  btnAjax.click();
}
/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});