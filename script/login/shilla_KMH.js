var tLoginCount = 0;
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["usrId"]) {
    tLoginCount++;
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  usrId.value = "${login_id}";
  usrPwd.value = "${login_password}";
  fnLogin.click();
}
