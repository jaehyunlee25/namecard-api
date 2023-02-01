function mneCall(date, callback) {
  const param = {
    book_yymm: date,
  };
  get("/html/reservation/reserve01.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "href";
    const els = ifr.gba(attr, "JavaScript:Date_Click", true);
    Array.from(els).forEach((el) => {
      const [sign, date, gb] = el.attr(attr).inparen();
      dates.push([date, sign, gb]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/html/reservation/reserve01.asp";
  const method = "post";
  const param = {
    proc_div: sign,
    book_yymm: date.ct(2),
    book_date: date,
    cripto_date: gb,
  };
  const dictCourse = {
    1: "동코스",
    2: "서코스",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time] = el.attr(attr).inparen();
      const hole = 18;
      course = dictCourse[course];
      const fee_normal = 200000;
      const fee_discount = 200000;

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