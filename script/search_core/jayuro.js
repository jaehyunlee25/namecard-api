function mneCall(date, callback) {
  intvEl = window["ViewReservationCalendar"];
  ${mneCallCommon}
  function exec() {
    const tbls = doc.gcn("calendar");
    const as = [];
    tbls.forEach((tbl) => {
      const tmp = tbl.gtn("a");
      tmp.forEach((a) => {
        if (!a.attr("href")) return;
        as.push(a);
      });
    });
    as.forEach((a) => {
      const obj = procHref(a.attr("href"));
      dates.push([obj.date, obj.param]);
    });
  
    callback();
  }
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$contents$htbArgs"] = strParam;
  param["ctl00$contents$ScptManager"] =
    "ctl00$Content$ScptManager|ctl00$Content$btnUp";
  param["__EVENTTARGET"] = "ctl00$Content$btnUp";

  post("Reservation", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr.getElementsByClassName("timeTbl")[0];
    const els = tbl.getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = el.children[1].innerText;
      const time = el.children[2].innerText;
      const fee_discount =
        el.children[4].innerText.ct(1).split(",").join("") * 1;
      const fee_normal = el.children[4].innerText.ct(1).split(",").join("") * 1;

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

function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: str.split("|")[2].split("-").join(""), param: values[0] };
}

/* <============line_div==========> */

mneCall(thisdate, () => {
  Update(
    "CALENDAR|" + nextdate.gh(4) + "-" + nextdate.ch(4).gh(2) + "-" + "01|"
  );
  mneCall(nextdate, procDate);
});
