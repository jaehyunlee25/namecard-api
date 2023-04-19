var tLoginCount = 0;
EXTZLOG("login", "tLoginCount: " + tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["usrId"]) {
    tLoginCount++;
    EXTZLOG("login", "tLoginCount: " + tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  usrId.value = "${login_id}";
  usrPwd.value = "${login_password}";
  fnLogin.click();
}
