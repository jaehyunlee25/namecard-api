    const { clubs } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    clubs.forEach((club) => {
      const result = reserveSearchbotAdmin({ club });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };