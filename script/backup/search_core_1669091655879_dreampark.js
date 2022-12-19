function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "javascript:transDate", true);
  Array.from(els).forEach((el) => {
    const [date, opt] = el.attr("onclick").inparen();
    if (opt != "R") return;
    dates.push([date, ""]);
  });
  callback();
}
 
/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/A1_2N.asp?bk_div=R";
  const method = "post";
  const param = {
    submitDate: date,
    bk_div: "R",
  };
  const dictCourse = {
    A: "DREAM_OUT",
    B: "DREAM_IN",
    C: "PARK_OUT",
    D: "PARK_IN",
  };
  const arr = ["A", "B", "C", "D"];

  exec();
  function exec() {
    let course = arr.shift();
    if (!course) {
      procDate();
      return;
    }
    param.cos_div = course;
    fCall[method](addr, param, {}, (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gba("onclick", "JavaScript:onclick=bookProsecc", true);
      Array.from(els).forEach((el) => {
        let [date, time, course] = el.attr("onclick").inparen();
        course = dictCourse[course];
        const hole = 18;
        fee_normal = 150000;
        fee_discount = 150000;

        let flg = true;
        golf_schedule.forEach((ob) => {
          if (
            (ob.date = date && ob.time == time && ob.golf_course_id == course)
          )
            flg = false;
        });

        if (flg)
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
      exec();
    });
  }
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
