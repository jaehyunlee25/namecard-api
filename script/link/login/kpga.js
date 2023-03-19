var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (doc.gcn("login").length == 0) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gcn("login")[0].children[0].children[0].value = "${login_id}";
  doc.gcn("login")[0].children[1].children[0].value = "${login_password}";
  doc.gcn("login")[0].children[2].children[0].click();
}
