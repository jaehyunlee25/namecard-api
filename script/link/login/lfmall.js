var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (doc.gbn("memberId").length == 0) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gbn("memberId")[0].value = "${login_id}";
  doc.gbn("password")[0].value = "${login_password}";
  doc.gcn("LoginButton_btnType6__EW7e+ LoginButton_btnRed__Ur+hD")[0].click();
}
