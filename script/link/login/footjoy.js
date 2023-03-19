var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["dwfrm_login_username_d0nuncvezutq"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  window["dwfrm_login_username_d0nuncvezutq"].value = "${login_id}";
  window["dwfrm_login_password_d0qnbrvrvyaf"].value = "${login_password}";
  doc.gbn("dwfrm_login_login")[1].click();
}
