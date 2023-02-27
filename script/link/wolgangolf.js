javascript: (() => {
    ${commonScript}
  
    get("${link}", {mcode: "m11gy55"}, {}, (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;
      const attr = "class";
      const els = ifr.gba(attr, "title", true);
      const res = [];
      els.forEach((el) => {
        res.push({
          link_address: "${link}",
          link_name: "[${link_name}]",
          link_content: el.nm(0, 0).str(),
          link_datetime: el.nm(1, 2).str(),
        });
      });
      acParam.command = "SUCCESS_OF_GET_LINK";
      acParam.content = res;
      if (ac) {
        ac.message(JSON.stringify(acParam));
      }
    });
  })();
  