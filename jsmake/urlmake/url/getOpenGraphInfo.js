    ogs({ url: data.url }).then((data) => {
      if (data.error) objResp = { result: "error", data: data.error };
      else objResp = { result: "okay", data: data.result };
      response.write(JSON.stringify(objResp));
      response.end();
    });