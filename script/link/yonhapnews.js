javascript: (() => {
  ${commonScript}

  get("${link}", {}, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "class";
    const els = ifr.gcn("section01")[0].gba(attr, "tit-news", true);
    const res = [];
    els.forEach((el) => {
      res.push({
        link_address: "${link}",
        link_name: "[${link_name}]",
        link_content: el.str(),
        link_datetime: el.nm(3, 0, 1).str(),
      });
    });
    acParam.command = "SUCCESS_OF_GET_LINK";
    acParam.content = res;
    if (ac) {
      ac.message(JSON.stringify(acParam));
    }
  });
})();
