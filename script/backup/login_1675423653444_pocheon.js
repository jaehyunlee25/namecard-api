var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (doc.gcn("cpInput").length == 0) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gcn("cpInput")[0].value = "${login_id}";
  doc.gcn("cpInput")[1].value = "${login_password}";
  chkLogValue(
    "frmLogin",
    "in",
    "login_id",
    "login_pw",
    "chk_saveid",
    "chk_savepw"
  );
}
