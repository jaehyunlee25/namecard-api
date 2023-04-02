    setGolfClubState(data, (rows) => {
      objResp = {
        resultCode: 200,
        message: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });