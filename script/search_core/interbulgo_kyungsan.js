function mneCall(date, callback) {
  const param = {};
  get("/mobile/reservation_04.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "Date_Click(", true);
    Array.from(els).forEach((el) => {
      const [year, month, dt, sign] = el.attr(attr).inparen();
      const fulldate = [year, month, dt].join("");
      dates.push([fulldate, sign]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, sign] = arrDate;
  const param = {
    book_date_bd: date + sign,
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };
  const dictCourse = {
    1: "Sky",
    2: "Mountain",
    3: "Valley",
  };

  post("/mobile/reservation_05.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "JavaScript:Book_Confirm(", true);
    Array.from(els).forEach((el) => {
      let [date, , course, fee, time] = el.attr(attr).inparen();

      date = date.ct(1);
      course = dictCourse[course];
      const fee_normal = fee * 1;
      const fee_discount = fee * 1;
      const hole = 18;
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
