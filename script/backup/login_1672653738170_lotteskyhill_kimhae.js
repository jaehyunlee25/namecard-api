window["user-id-1"].value = '${login_id}';
window["user-pw-1"].value = '${login_password}';
doc.body.gba("class", "submit-complete")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const str = doc.gba("class", "logout");
  if (str.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */