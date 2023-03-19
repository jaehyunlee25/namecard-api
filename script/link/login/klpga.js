var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (doc.gbn("id").length == 0) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gcn("btn_login_open")[0].click();
  doc.gbn("logck")[1].click();
  doc.gbn("id")[0].value = "${login_id}";
  doc.gbn("pw")[0].value = "${login_password}";
  fn_login();
}
