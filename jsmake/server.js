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
    let body = [];
    try {
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

          if (request.method === "GET") {
            response.write("hello, world!");
            response.end();
          }

          if (request.method === "POST") {
            try {
              procPost(request, response, data);
            } catch (e) {
              log(e);
            }
          }
        });
    } catch (e) {
      console.log(e);
    }
  })
  .listen(8080);
