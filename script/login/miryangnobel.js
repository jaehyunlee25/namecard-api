var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["userId1"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  userId1.value = "${login_id}";
  userPw1.value = "${login_password}";
  doc.gcn("btn btn-block btn-login btn-lg")[0].click();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "로그아웃";
    const str = doc.gcn("loginBtn")[0].str().trim();
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
