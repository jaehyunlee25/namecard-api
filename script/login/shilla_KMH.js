var tLoginCount = 0;
EXTZLOG("login", "tLoginCount: " + tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  EXTZLOG("login", "timeraction_0");
  if (!window["usrId"]) {
    tLoginCount++;
    EXTZLOG("login", "tLoginCount: " + tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  EXTZLOG("login", "timeraction_1");
  clearInterval(tLogin);
  EXTZLOG("login", "timeraction_2");
  if (precheck()) return;
  EXTZLOG("login", "timeraction_3");
  usrId.value = "${login_id}";
  EXTZLOG("login", "timeraction_4");
  EXTZLOG("login", usrId.value);
  usrPwd.value = "${login_password}";
  EXTZLOG("login", "timeraction_5");
  EXTZLOG("login", usrPwd.value);
  EXTZLOG("login", "fnLogin" + fnLogin);
  /*fnLogin.click();*/
  EXTZLOG("login", "timeraction_6");
}
