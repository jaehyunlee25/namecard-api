} else {
  const engName = reqUrl.substring(1);
  url = golfClubLoginUrl[engName];
  script = getLoginScript(engName);
  objResp = {
    url,
    script,
  };
}
if (objResp) {
  // console.log("obj", objResp);
  response.write(JSON.stringify(objResp));
  response.end();
}
