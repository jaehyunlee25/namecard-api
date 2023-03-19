var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["dunlop_id"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  window["dunlop_id"].value = "${login_id}";
  window["dunlop_pwd"].value = "${login_password}";
  doc.gcn("btn medium red memberLogin medium2")[0].click();
}
