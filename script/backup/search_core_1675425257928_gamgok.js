function mneCall(date, callback) {
  const attr = "href";
  const els = doc.gba(attr, "JavaScript:Date_Click", true);
  Array.from(els).forEach((el) => {
    const [sign, fulldate] = el.attr(attr).inparen();
    dates.push([fulldate, sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/html/reserve/reserve01.asp";
  const method = "get";
  const param = {
    proc_div: sign,
    book_yymm: date.gt(2),
    book_date: date,
  };
  const dictCourse = {
    1: "Peach",
    2: "Glen",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "JavaScript:Book_Confirm(", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time, , fee] = el.attr(attr).inparen(true);
      time = time.rm(":");
      course = dictCourse[course];
      const hole = el.nm(2, 2, 0).str().ct(1);
      fee = fee.rm(",") * 1;
      fee_normal = fee;
      fee_discount = fee;

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
mneCall(thisdate, procDate);