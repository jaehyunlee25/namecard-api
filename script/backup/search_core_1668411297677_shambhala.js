function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    method: "getCalendar",
    coDiv: "22",
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      if (el.BK_TEAM == "0") return;
      dates.push([el.CL_SOLAR, el.CL_BUSINESS]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/controller/ReservationController.asp";
  const method = "post";
  const param = {
    method: "getTeeList",
    coDiv: "22",
    date: date,
  };
  const dictCourse = {
    A: "마운틴",
    B: "레이크",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      let {
        BK_CHARGE: fee,
        BK_COS: course,
        BK_DAY: date,
        BK_ROUNDF_NM: hole,
        BK_TIME: time,
      } = el;
      course = dictCourse[course];
      fee_normal = fee.rm(",") * 1;
      fee_discount = fee.rm(",") * 1;

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
