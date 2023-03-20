javascript: (() => {
  ${commonScript}

  document.head.children[0].setAttribute(
    "content",
    "text/html; charset=utf-8;"
  );
  const attr = "class";
  const els = doc.gba(attr, "titles", true);
  const res = [];
  els.forEach((el) => {
    if (!el.children[0]) return;
    res.push({
      link_round: "${round}",
      link_address: "${link}",
      link_name: "${link_name}",
      link_content: el.children[0].str(),
      link_datetime: el.nm(1, 2, 0).str(0),
    });
  });
  REGNEWS(res, (data) => {
    acParam.command = "SUCCESS_OF_GET_LINK";
    acParam.eng_id = "${link_name}";
    if (ac) {
      ac.message(JSON.stringify(acParam));
    }
  });
})();
