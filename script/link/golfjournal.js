javascript: (() => {
  ${commonScript}

  get("${link}", {}, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "class";
    const els = ifr.gba(attr, "list-titles", true);
    const res = [];
    els.forEach((el) => {
      res.push({
        link_address: "${link}",
        link_name: "${link_name}",
        link_content: el.nm(0, 0, 0).str(),
        link_datetime: el.nm(1, 1, 1).str().split(" | ")[1],
      });
    });
    REGNEWS(res, (data) => {
      acParam.command = "SUCCESS_OF_GET_LINK";
      acParam.eng_id = "${link_name}";
      if (ac) {
        ac.message(JSON.stringify(acParam));
      }
    });
  });
})();
