const { file } = files;
const { size, filepath, newFilename, mimetype, mtime, originalFilename } = file;
const currentFile = "temp/" + newFilename;
client
  //.labelDetection("letters.jfif")
  .documentTextDetection(currentFile)
  .then((results) => {
    fs.unlinkSync(currentFile);
    /* const labels = results[0].labelAnnotations;
          labels.forEach((label) => log(label.description));
          Object.entries(fullTextAnnotation).forEach(([key, val]) => {
          if (key == "pages") {
            console.log(JSON.stringify(val[0]));
          }
        }); */
    const [result] = results;
    const { fullTextAnnotation } = result;
    objResp = {
      fullTextAnnotation,
      data,
      files,
    };
    response.write(JSON.stringify(objResp));
    response.end();
  })
  .catch((err) => {
    console.error("ERROR:", err);
  });
