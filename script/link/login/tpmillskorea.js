var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (doc.gbn("com_member_login_id").length == 0) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gbn("com_member_login_id")[0].value = "${login_id}";
  doc.gbn("com_member_login_pw")[0].value = "${login_password}";
  doc.gbn("login_ok")[0].click();
}
