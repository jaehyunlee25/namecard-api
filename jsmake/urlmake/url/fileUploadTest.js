const { file } = files;
const { size, filepath, newFilename, mimetype, mtime, originalFilename } = file;
const currentFile = "temp/" + newFilename;
getChecksum(currentFile, (checksum) => {
  const addr = "temp/" + checksum + ".json";
  const chk = fs.existsSync(addr);
  if (chk) {
    fs.unlinkSync(currentFile);
    objResp = fs.readFileSync(addr, "utf-8").jp();
    response.write(JSON.stringify(objResp));
    response.end();
    return;
  }
  getTextDetection(currentFile, (results) => {
    fs.unlinkSync(currentFile);
    const [result] = results;
    const { fullTextAnnotation: fta } = result;

    let letters = [];
    const { text, pages } = fta;
    const [page] = pages;
    const { blocks, confidence, height, width, property } = page;
    const { detectedBreak, detectedLanguages } = property;
    //log(confidence, height, width);
    detectedLanguages.forEach(({ languageCode, confidence }) => {
      //log(languageCode, confidence);
    });
    blocks.forEach((ob) => {
      const { blockType, confidence, property, boundingBox, paragraphs } = ob;
      const { vertices } = boundingBox;
      /* log(blockType, confidence, property);
      log(boundingBox);
      mkBox(vertices);
      log(paragraphs); */

      paragraphs.forEach(({ words, boundingBox, confidence, property }) => {
        const { vertices } = boundingBox;
        //mkBox(vertices, "blue");
        words.forEach((ob) => {
          const { boundingBox, confidence, property, symbols } = ob;
          const { vertices } = boundingBox;
          //mkBox(vertices, "green");
          symbols.forEach((ob) => {
            const { boundingBox, confidence, property, text } = ob;
            const { vertices } = boundingBox;
            letters.push({ text, vertices });
            //mkBox(vertices, "blue");
          });
        });
      });
    });

    const detectedCells = LINEDETECTOR(letters);
    const dc = detectedCells;
    let detectedResult;
    if (dc && dc[0] && dc[0][0]) {
      const title_top = dc[0][0].children[0][0].text;
      const title_bottom = dc[0][0].children[1][0].text;
      if (title_top == "SMART" && title_bottom == "SCORE") {
        const {
          1: { text: date },
          2: { text: time },
          3: { text: userName },
        } = dc[0];
        const golf_club_name = dc[1][0].children[0][0].text;
        const golf_course = dc[1][0].children[1][0].text.split(",");
        const all_sum = dc[1][1].text;
        const golf_score = (() => {
          const res = [];
          Object.entries(dc).forEach(([key, val]) => {
            if (key < 2) return;
            if (Object.entries(val).length < 10) return;
            const tmp = [];
            Object.entries(val).forEach(([k, score]) => {
              const hole = k * 1 + 1;
              tmp.push(score.text);
            });
            res.push(tmp);
          });
          return res;
        })();
        detectedResult = {
          date,
          time,
          userName,
          golf_club_name,
          all_sum,
          golf_course,
          golf_score,
        };
      }
    }

    objResp = {
      detectedResult,
      data,
      files,
    };
    fs.writeFileSync(addr, JSON.stringify(objResp), "utf-8");
    response.write(JSON.stringify(objResp));
    response.end();
  });
});
function getTextDetection(file, callback) {
  client
    //.labelDetection("letters.jfif")
    .documentTextDetection(file)
    .then((results) => {
      callback(results);
      /* const labels = results[0].labelAnnotations;
            labels.forEach((label) => log(label.description));
            Object.entries(fullTextAnnotation).forEach(([key, val]) => {
            if (key == "pages") {
              console.log(JSON.stringify(val[0]));
            }
          }); */
    })
    .catch((err) => {
      console.error("ERROR:", err);
      objResp = { error: err };
      response.write(JSON.stringify(objResp));
      response.end();
    });
}
function getChecksum(path, callback) {
  const fileStream = fs.createReadStream(path);
  const hash = crypto.createHash("sha256");
  fileStream.pipe(hash);
  hash.on("finish", () => {
    const checksum = hash.digest("hex");
    callback(checksum);
  });
}
