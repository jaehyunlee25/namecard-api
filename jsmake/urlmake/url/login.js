    const uuid = data.clubId;
    const engName = golfClubIdToEng[uuid];
    url = golfClubLoginUrl[engName];
    script = getLoginScript(engName);
    proc = golfClubLoginProc[uuid];
    objResp = {
      url,
      script,
      procProc: proc ? proc.proc : "",
      procResult: proc ? proc.result : "",
      procMessage: proc ? proc.message : "",
      procLandingLink: proc ? proc.landingLink : "",
    };