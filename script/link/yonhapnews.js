javascript: (() => {
  ${commonScript}
  console.log("puppeteer test");
  get("${link}", {}, {}, (data) => {
    console.log(data);
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "class";
    const els = ifr.gcn("section01")[0].gba(attr, "tit-news", true);
    const res = [];
    els.forEach((el, i) => {
      res.push({
        link_round: "${round}",
        link_number: i,
        link_address: "${link}",
        link_name: "${link_name}",
        link_content: el.str(),
        link_datetime: el.nm(3, 0, 1).str(),
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
