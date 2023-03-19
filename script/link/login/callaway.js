var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["gigya-loginID-148211896625471870"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  window["gigya-loginID-148211896625471870"].value = "${login_id}";
  window["gigya-password-152389310048898850"].value = "${login_password}";
  window["button1"].click();
}
