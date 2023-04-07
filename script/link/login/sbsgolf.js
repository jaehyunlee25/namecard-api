log("check", doc.gcn("gmembers_link_login").length);
if (doc.gcn("gmembers_link_login").length > 0) {
  log("check", doc.gcn("gmembers_link_login")[0].str());
  if (doc.gcn("gmembers_link_login")[0].str() == "로그인") {
    log("check", "enter");
    doc.gcn("gmembers_link_login")[0].click();
    return;
  }
}

var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["loginId"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  window["loginId"].value = "${login_id}";
  window["loginPw"].value = "${login_password}";
  window["loginBtn"].click();
}
