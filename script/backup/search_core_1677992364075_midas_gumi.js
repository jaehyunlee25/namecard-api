function mneCall(date, callback) {
  let count = 0;
  const mneT = setInterval(funcInterval, 500);
  const intvEl = window["golf_calendar"];
  const logPrm = { LOGID, step: "mneCall_interval" };
  function funcInterval() {
    if (!intvEl) {
      EXTZLOG("search", ["interval count", count].join(", "), logPrm);
      count++;
      if (count > 10) {
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
    const els = doc.gtn("td");
    const tds = [];
    Array.from(els).forEach((el) => {
      const tee = el.attr("data-cnt");
      if (!tee || tee == 0) return;
      tds.push(el);
    });

    tds.forEach((td) => {
      const strDate = td.attr("data-day");
      dates.push([strDate, 0]);
    });

    callback();
  }
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    lgubun: "160",
    date: date,
    changeDate: "",
    changeSeq: "",
  };
  post("/Reservation/AjaxTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if (i === 0) return;

      const course = tr.getAttribute("data-coursekor");
      const time = tr.children[1].innerHTML;
      const fee_normal = tr.children[2].innerHTML.ct(1).replace(/\,/g, "") * 1;
      const fee_discount =
        tr.children[2].innerHTML.ct(1).replace(/\,/g, "") * 1;
      const slot = time.gh(2);

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

mneCall(thisdate, procDate);
