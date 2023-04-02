let golfClubEngNames = [];
let golfClubIdToEng = {};
let golfClubEngToKor = {};
let golfClubIds = {};
let golfClubLoginUrl = {};
let golfClubLoginUrlByUUID = {};
let golfClubSearchUrl = {};
let golfClubReserveUrl = {};
let golfClubAccounts = {};
let golfCourseByEngId = {};
let golfCourseByUUID = {};
let golfClubLoginProc = {};
let golfClubs = {};
let golfCourses = {};
let golfClubGroups = {};
let groupClubs = {};
let LINE_DIVISION = "\n/* <============line_div==========> */\n";
let ENV = ".env".gfjp();
let golfLinks = {};

"sql/getGolfClub.sql".gf().query(getGolfClub);
"sql/getGolfCourse.sql".gf().query(getGolfCourse);
"sql/golfClubNames.sql".gf().query(getClubNames);
"sql/getLoginUrl.sql".gf().query(getLoginUrl);
"sql/getSearchUrl.sql".gf().query(getSearchUrl);
"sql/getReserveUrl.sql".gf().query(getReserveUrl);
"sql/getAccount.sql".gf().query(getAccounts);
"sql/golf_course.sql".gf().query(getGolfCourses);
"sql/proc_login.sql".gf().query(getProcLogins);
"sql/getGolfClubGroup.sql".gf().query(getGolfClubGroup);

DATACOLLECT();
setInterval(DATACOLLECT, 1000 * 60);

function DATACOLLECT() {
  log("DATACOLLECT");
  "sql/getGolfLink.sql".gfdp({ section: "" }).query(getGolfLink);
}
function getGolfLink(err, rows, fields) {
  rows.forEach((row) => {
    golfLinks[row.eng_id] = row;
  });
}
function getGolfClubGroup(err, rows, fields) {
  rows.forEach((row) => {
    groupClubs[row.golf_club_id] = row.name;
    if (!golfClubGroups[row.name]) golfClubGroups[row.name] = [];
    golfClubGroups[row.name].push(row);
  });
}
function getGolfClub(err, rows, fields) {
  rows.forEach((row) => {
    golfClubs[row.id] = row;
  });
}
function getGolfCourse(err, rows, fields) {
  rows.forEach((row) => {
    if (!golfCourses[row.golf_club_id]) golfCourses[row.golf_club_id] = {};
    golfCourses[row.golf_club_id][row.name] = row;
  });
}
function getProcLogins(err, rows, fields) {
  rows.forEach((row) => {
    golfClubLoginProc[row.id] = {
      result: row.result,
      proc: row.proc,
      message: row.message,
      landingLink: row.landing_link,
    };
  });
}
function getGolfCourses(err, rows, fields) {
  rows.forEach((row) => {
    if (!golfCourseByEngId[row.golf_club_english_name])
      golfCourseByEngId[row.golf_club_english_name] = [];
    golfCourseByEngId[row.golf_club_english_name].push(row);

    if (!golfCourseByUUID[row.golf_club_id])
      golfCourseByUUID[row.golf_club_id] = [];
    golfCourseByUUID[row.golf_club_id].push(row);
  });
}
function getAccounts(err, rows, fields) {
  rows.forEach((row) => {
    golfClubAccounts[row.golf_club_english_name] = {
      id: row.golf_club_login_url_admin_id,
      pw: row.golf_club_login_url_admin_pw,
    };
  });
  // console.log(golfClubAccounts);
}
function getClubNames(err, rows, fields) {
  if (err) log(err);
  rows.forEach((row) => {
    golfClubEngNames.push(row.eng_id);
    golfClubIds[row.eng_id] = row.golf_club_id;
    golfClubIdToEng[row.golf_club_id] = row.eng_id;
    golfClubEngToKor[row.eng_id] = row.name;
    // console.log(row.eng_id);
    // if(row.eng_id != "allday") fs.writeFileSync("script/search/" + row.eng_id + ".js", "");
  });
  // console.log(golfClubIds);
}
function getLoginUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubLoginUrl[row.golf_club_english_name] =
      row.golf_club_login_url_mobile;
    golfClubLoginUrlByUUID[row.golf_club_uuid] = row.golf_club_login_url_mobile;
  });
  // console.log(golfClubLoginUrl);
}
function getSearchUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubSearchUrl[row.golf_club_english_name] =
      row.golf_club_search_url_mobile;
  });
  // console.log(golfClubSearchUrl);
}
function getReserveUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubReserveUrl[row.golf_club_english_name] =
      row.golf_club_search_url_mobile;
  });
}
