var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (doc.gcn("input-text email-input required").length == 0) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gcn("input-text email-input required")[0].value = "${login_id}";
  window["dwfrm_login_password"].value = "${login_password}";
  doc.gbn("dwfrm_login_login")[0].click();
}
