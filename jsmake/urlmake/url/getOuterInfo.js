    const { club_id: clubId } = data;
    "sql/getOuterInfo.sql".gfdp({ clubId }).query((err, rows, fields) => {
      if (err) console.log(err);
      objResp = {
        data: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });