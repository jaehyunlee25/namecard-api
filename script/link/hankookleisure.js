javascript: (() => {
    ${commonScript}
    
    document.head.children[0].setAttribute(
        "content",
        "text/html; charset=utf-8;"
    );
    const attr = "class";
    const els = doc.gba(attr, "list-titles", true);
    const res = [];
    els.forEach((el) => {
    res.push({
        link_address: "${link}",
        link_name: "[${link_name}]",
        link_content: el.str(),
        link_datetime: el.nm(2, 2, 0).str(),
    });
    });
    acParam.command = "SUCCESS_OF_GET_LINK";
    acParam.content = res;
    if (ac) {
        ac.message(JSON.stringify(acParam));
    }
  })();
  