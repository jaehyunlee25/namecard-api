function mneCall(date, callback) {
  ${mneCallCommon}
  function exec() {
    const tds = calendarBox1.gcn("possible");
    tds.forEach((td) => {
      const num = td.innerText;
      const fulldate = date + num;
      dates.push([fulldate, 0]);
    });
    callback();
  }
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    method: "getTeeList",
    coDiv: "77",
    cos: "All",
    part: "All",
    date: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const objResp = JSON.parse(data).rows;
    const dict = { A: "OX", B: "Field" };
    objResp.forEach((obj) => {
      const course = dict[obj.BK_COS];
      const time = obj.BK_TIME.gh(2) + ":" + obj.BK_TIME.gt(2);
      const fee_normal = obj.BK_BASIC_CHARGE.replace(/\,/g, "") * 1;
      const fee_discount = obj.BK_CHARGE.replace(/\,/g, "") * 1;

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
  doNextMonth();
  mneCall(nextdate, procDate);
});
