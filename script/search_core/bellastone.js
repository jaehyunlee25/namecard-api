function mneCall(date, callback) {
  const els = doc.gcn("reserv");
  Array.from(els).forEach((el) => {
    const [, date, sign] = el.attr("href").inparen();
    const fulldate = date.rm("-");
    dates.push([fulldate, sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, sign] = arrDate;
  const param = {};
  param["thisDate"] = (date.ct(2) + "01").datify();
  param["strReserveDate"] = date.datify();
  param["strDayGubun"] = sign;
  const dictCourse = {};
  post("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("timeTbl")[0].gtn("tbody")[0].gtn("tr");

    Array.from(els).forEach((el, i) => {
      const course = el.children[0].innerText;
      const time = el.children[1].innerText;
      let fee_normal = el.children[3].innerText.split(",").join("") * 1;
      let fee_discount = el.children[3].innerText.split(",").join("") * 1;

      if (isNaN(fee_normal)) fee_normal = -1;
      if (isNaN(fee_discount)) fee_discount = -1;

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
mneCall(thisdate, procDate);