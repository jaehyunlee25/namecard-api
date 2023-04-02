    const { clubs } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    const command = "GET_DATE";
    clubs.forEach((club) => {
      const result = searchbotDate({ club, command });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };