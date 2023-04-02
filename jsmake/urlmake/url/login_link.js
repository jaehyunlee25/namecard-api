    const { link_eng_id } = data;
    objResp = {
      url: golfLinks[link_eng_id].login_url,
      script: getLinkLoginScript(link_eng_id),
    };