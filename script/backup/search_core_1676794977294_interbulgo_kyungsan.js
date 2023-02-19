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

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
