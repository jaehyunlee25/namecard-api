    "sql/setQuestion.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        console.log(err);
        objResp = {
          type: "error",
          data: err,
        };
      } else {
        objResp = {
          type: "okay",
          message: "성공적으로 접수되었습니다.",
        };
      }
      response.write(JSON.stringify(objResp));
      response.end();
    });