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
  Login_Check();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "logout";
    const str = doc
      .gcn("loginBtn")[0]
      .children[0].attr("src")
      .split("/")[3]
      .split(".")[0];
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
