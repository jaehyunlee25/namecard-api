    const { clubs, date } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    const command = "GET_TIME";
    clubs.forEach((club) => {
      const result = searchbotTimeAdmin({ club, command, date });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };