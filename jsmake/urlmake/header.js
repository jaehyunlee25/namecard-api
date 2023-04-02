log("request url", request.url);
log("data", data);
if (data.club && !golfClubAccounts[data.club]) {
  response.write(
    JSON.stringify({
      url: "",
      script: "",
    })
  );
  response.end();
  return;
}

let url;
let script;
let objResp;
const reqUrl = "/" + request.url.split("/").lo();

if (reqUrl == "/dummy") {