    const path = "/var/www/html/teelog";
    const files = fs.readdirSync(path);
    objResp = {
      result: "okay",
      data: files,
    };