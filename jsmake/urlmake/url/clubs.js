    const result = [];
    const clubIds = {};
    const clubStates = {};
    getClubs((rows) => {
      rows.forEach((row) => {
        result.push(row.eng_id);
        clubIds[row.eng_id] = row.id;
        clubStates[row.eng_id] = row.golf_club_state;
      });
      objResp = {
        clubs: result,
        clubIds,
        clubStates,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
    objResp = 0;