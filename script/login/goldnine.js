var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (undefined) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gbn("login_id")[0].value = "${login_id}";
  doc.gbn("login_pw")[0].value = "${login_password}";
  login_check(this.form);

  /* begin: precheck content */
  function precheck() {
    const strLogout = "로그아웃";
    const str = doc.gcn("global_menu")[0].children[1].str();
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
