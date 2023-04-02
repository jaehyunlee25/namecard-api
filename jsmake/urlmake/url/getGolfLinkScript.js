    const commonScript = "script/link/common.js".gfdp(ENV);
    const { links, round } = data;
    const urls = [];
    const scripts = [];

    links.forEach((eng_id) => {
      const link_name = eng_id;
      const link = golfLinks[eng_id].link;
      const param = { link, link_name, commonScript, round };
      const file = "script/link/" + eng_id + ".js";
      urls.push(link);
      scripts.push(file.gfdp(param));
    });
    objResp = {
      links,
      urls,
      scripts,
    };