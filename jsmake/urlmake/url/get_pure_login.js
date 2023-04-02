    const engName = data.club;
    let core = "";
    try {
      core = fs.readFileSync("script/login/" + engName + ".js", "utf-8");
    } catch (e) {
      fs.writeFileSync("script/login/" + engName + ".js", core);
    }
    response.write(JSON.stringify({ core }));
    response.end();
    return;