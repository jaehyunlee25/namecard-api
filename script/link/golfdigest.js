javascript: (() => {
  ${commonScript}

  get("${link}", {}, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "class";
    const els = ifr.gba(attr, "list-titles", true);
    const res = [];
    els.forEach((el, i) => {
      if (i > 4) return;
      res.push({
        link_round: "${round}",
        link_number: i,
        link_address: "${link}",
        link_name: "${link_name}",
        link_content: el.nm(0, 1, 0).str(),
        link_datetime: el.nm(1, 2).str().split("|")[1].trim(),
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
