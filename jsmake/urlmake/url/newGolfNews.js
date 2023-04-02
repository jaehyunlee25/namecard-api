    const { news } = data;
    const vls = [];
    news.forEach((ob) => {
      let {
        link_round: round,
        link_number: number,
        link_address: address,
        link_name: eng_id,
        link_content: content,
        link_datetime: datetime,
      } = ob;
      content = content.replace(/"/g, '\\"');
      const tpl = `(uuid(), "${round}", "${number}", "${address}", "${eng_id}", "${content}", "${datetime}", now(), now())`;
      log(tpl);
      vls.push(tpl);
    });
    const strValues = vls.join(",");
    "sql/newGolfNews.sql".gfdp({ strValues }).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });