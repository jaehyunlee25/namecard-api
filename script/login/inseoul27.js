var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["memberID"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  memberID.value = "${login_id}";
  memberPassword.value = "${login_password}";
  doc.gbn("loginForm")[0].submit();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "LOGOUT";
    const str = doc.gcn("tmenu")[1].gtn("a")[0].str().trim();
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
