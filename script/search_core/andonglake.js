function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "461",
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.rows;
    els.forEach((el) => {
      if (el.BK_TEAM == "0") return;
      dates.push([el.CL_SOLAR, el.CL_BUSINESS, el.CL_DAYDIV]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/controller/ReservationController.asp";
  const method = "get";
  const param = {
    method: "getTeeList",
    coDiv: "461",
    date: date,
    cos: "All",
    _: new Date().getTime(),
  };
  const dictCourse = {
    A: "Out",
    B: "In",
  };

  fCall[method](addr, param, {}, (data) => {
    const els = data.jp().rows;
    Array.from(els).forEach((el) => {
      let {
        BK_DAY: date,
        BK_TIME: time,
        BK_COS: course,
        BK_ROUNDF_NM: hole,
        BK_S_CHARGE_NM: fee_normal,
        BK_B_CHARGE_NM: fee_discount,
      } = el;
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
