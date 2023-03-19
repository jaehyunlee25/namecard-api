doc.gcn("account__btn")[0].click();
var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (doc.gbn("mb_id").length == 0) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gbn("mb_id")[0].value = "${login_id}";
  doc.gbn("password")[0].value = "${login_password}";
  loginSend();
}
