javascript: (() => {
  ${commonScript}

  document.head.children[0].setAttribute(
    "content",
    "text/html; charset=utf-8;"
  );
  const attr = "class";
  const els = doc.gba(attr, "list-titles", true);
  const res = [];
  els.forEach((el, i) => {
    if (i > 4) return;
    res.push({
      link_round: "${round}",
      link_number: i,
      link_address: "${link}",
      link_name: "${link_name}",
      link_content: el.str(),
      link_datetime: el.nm(2, 2, 0).str(),
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
