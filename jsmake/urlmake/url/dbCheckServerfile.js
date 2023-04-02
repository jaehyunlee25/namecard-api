    const eng = data.eng_id;
    objResp = {
      type: "okay",
      data: { check: false },
    };
    if (fs.existsSync("script/search_dict/" + eng + ".json"))
      objResp.data.check = true;