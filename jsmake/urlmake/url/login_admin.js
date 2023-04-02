    const { club } = data;
    objResp = {
      url: golfClubLoginUrl[club],
      script: getLoginScriptAdmin(club),
    };