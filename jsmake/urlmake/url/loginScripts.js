    const ids = data.clubIds;
    const urls = {};
    const scripts = {};
    const procProcs = {};
    const procLandingLinks = {};
    const procMessages = {};
    const procResults = {};
    ids.forEach((uuid) => {
      const engName = golfClubIdToEng[uuid];
      urls[uuid] = golfClubLoginUrl[engName];
      scripts[uuid] = getLoginScript(engName);
      proc = golfClubLoginProc[uuid];
      procProcs[uuid] = proc ? proc.proc : {};
      procLandingLinks[uuid] = proc ? proc.landingLink : {};
      procMessages[uuid] = proc ? proc.message : {};
      procResults[uuid] = proc ? proc.result : {};
    });

    objResp = {
      urls,
      scripts,
      procProcs,
      procLandingLinks,
      procMessages,
      procResults,
    };