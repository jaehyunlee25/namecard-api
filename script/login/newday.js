var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["user_id"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  user_id.value = "${login_id}";
  user_pw.value = "${login_password}";
  doc.body.gba("href", "JavaScript:Login1();")[0].click();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "로그아웃";
    const str = doc.gba("href", "/html/mypage/logout.asp");
    if (str.length > 0) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
