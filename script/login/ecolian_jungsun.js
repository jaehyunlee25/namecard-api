var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["f_id"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  f_id.value = "${login_id}";
  f_pw.value = "${login_password}";
  doc.gcn("btn_login")[0].children[0].click();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "로그아웃";
    const str = doc.gcn("footer_menu")[0].gtn("a")[0].str();
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
