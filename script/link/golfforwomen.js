javascript: (() => {
  ${commonScript}

  document.head.children[0].setAttribute(
    "content",
    "text/html; charset=utf-8;"
  );
  const attr = "class";
  const els = doc.gba(attr, "title", true);
  const res = [];
  let cnt = 0;
  els.forEach((el) => {
    res.push({
      link_round: "${round}",
      link_number: cnt++,
      link_address: "${link}",
      link_name: "${link_name}",
      link_content: el.str(),
      link_datetime: "",
    });
  });
  const els2 = nextDiv.gtn("h2");
  els2.forEach((el) => {
    res.push({
      link_round: "${round}",
      link_number: cnt++,
      link_address: "${link}",
      link_name: "${link_name}",
      link_content: el.children[0].str(),
      link_datetime: "",
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
