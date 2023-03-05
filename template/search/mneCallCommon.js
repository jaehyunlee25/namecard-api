EXTZLOG("search", "mneCall");
let count = 0;
const mneT = setInterval(funcInterval, INTV_TIME);
const logPrm = { LOGID, step: "mneCall_interval" };
function funcInterval() {
  if (!intvEl) {
    EXTZLOG("search", ["interval count", count].join(", "), logPrm);
    count++;
    if (count > INTV_COUNT) {
      EXTZLOG("search", ["interval count out", count].join(", "), logPrm);
      clearInterval(mneT);
      callback();
    }
    return;
  }
  clearInterval(mneT);
  exec();
}
