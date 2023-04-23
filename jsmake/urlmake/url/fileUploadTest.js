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
    const { fullTextAnnotation } = result;
    objResp = {
      fullTextAnnotation,
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
