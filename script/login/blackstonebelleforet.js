var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["usrId"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  usrId.value = "${login_id}";
  usrPwd.value = "${login_password}";
  fnLogin();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "로그아웃";
    const els = doc.body.gba("href", "/mobile/user/sign/Logout.do");
    if (els.length > 0) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
