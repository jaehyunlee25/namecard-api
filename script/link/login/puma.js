var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["login-form-email"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  window["login-form-email"].value = "${login_id}";
  window["login-form-password"].value = "${login_password}";
  doc.gba("type", "submit")[0].click();
}
