var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["V_IN_CYBER_ID"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  V_IN_CYBER_ID.value = "${login_id}";
  V_IN_CYBER_PASS.value = "${login_password}";
  btnAjax.click();

  /* begin: precheck content */
  function precheck() {
    if (window["logout"]) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
