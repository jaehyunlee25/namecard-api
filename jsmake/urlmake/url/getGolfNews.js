    "sql/getGolfNews.sql".gfdp({}).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      if (objResp.type == "okay") {
        const res = {};
        const result = { news: [], newsContents: [] };
        objResp.data.forEach((ob) => {
          const eng_id = ob.link_name;
          const name = golfLinks[ob.link_name].name;
          const id = golfLinks[ob.link_name].id;
          if (!res[eng_id])
            res[eng_id] = {
              eng_id,
              name,
              id,
              content: [],
            };
          ob.link_name = "[" + name + "]";
          result.newsContents.push(Object.assign({ eng_id, name }, ob));
          res[eng_id].content.push(ob);
        });
        Object.entries(res).forEach(([key, val]) => {
          result.news.push(val);
        });
        objResp.data = result;
      }
      response.write(JSON.stringify(objResp));
      response.end();
    });