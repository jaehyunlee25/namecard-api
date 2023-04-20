const server = http
  .createServer((request, response) => {
    console.log("http request", request.method);
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*", // for same origin policy
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type", // for application/json
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    });
    if (request.method === "OPTIONS") {
      response.end(JSON.stringify({}));
      return;
    }
    if (request.method === "GET") {
      response.write("hello, world!");
      response.end();
      return;
    }
    if (request.method != "POST") return;

    if (request.headers["content-type"].indexOf("multipart/form-data") != -1) {
      // 파일처리이므로 formidable을 이용한다.
      var form = new formidable.IncomingForm({
        uploadDir: "temp",
      });
      form.parse(request, (err, fields, files) => {
        if (err) {
          log(err);
          response.write(JSON.stringify({ data: err }));
          response.end();
          return;
        }
        try {
          procPost(request, response, fields, files);
        } catch (e) {
          log(e);
        }
      });
      return;
    }
    let body = [];
    request
      .on("data", (chunk) => {
        console.log("test", chunk.toString());
        body.push(chunk.toString());
      })
      .on("end", () => {
        let data;
        data = body.join("");
        try {
          log(data);
          data = JSON.parse(data);
        } catch (e) {
          console.log(e);
          console.log(data);
          return;
        }
        try {
          procPost(request, response, data);
        } catch (e) {
          log(e);
        }
      });
  })
  .listen(8080);
