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
  window["login_id"].value = "${login_id}";
  window["login_pw"].value = "${login_password}";
  doc.gcn("btn_submit")[0].click();

  /* begin: precheck content */

  function precheck() {
    /*
    const strLogout = "LOGOUT";
    const str = doc.gcn("member")[0].children[0].str();
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    */
    return false;
  }
  /* end: precheck content */
}
