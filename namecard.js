const http = require("http");
const fs = require("fs");
const formidable = require("formidable");
const crypto = require("crypto");
const vision = require("@google-cloud/vision");
const request = require("request");

const client = new vision.ImageAnnotatorClient({
  keyFilename: "tzocr_keyfile.json",
});
const log = function () {
  console.log("\n\n>> new log :: ", new Date());
  console.log(Array.from(arguments).join(", "));
};
const dir = function (arg) {
  console.log("\n\n>> new dir :: ", new Date());
  console.dir(arg);
};
const around = function (lmt, fnc) {
  for (var i = 0; i < lmt; i++) {
    var a = fnc(i);
    if (a) break;
  }
};
const fileUploadDir = "temp";

String.prototype.dp = function (param) {
  let self = this;
  const keys = Object.keys(param);
  keys.forEach((key) => {
    const regex = new RegExp("\\$\\{".add(key).add("\\}"), "g");
    const val = param[key];
    self = self.replace(regex, val);
  });
  return self;
};
String.prototype.add = function add(str) {
  return [this, str].join("");
};
String.prototype.jp = function () {
  return JSON.parse(this);
};
String.prototype.gf = function () {
  const path = this.toString();
  return fs.readFileSync(path, "utf-8");
};
String.prototype.gfjp = function () {
  return this.toString().gf().jp();
};
String.prototype.gfdp = function (param) {
  // log(this.toString().gf().dp(param));
  return this.toString().gf().dp(param);
};
String.prototype.query = function (callback) {
  try {
    const sql = this.toString();
    const dbconf = "db.json";
    const connection = mysql.createConnection(dbconf.gfjp());
    connection.connect();
    connection.query(sql, callback);
    connection.end();
  } catch (e) {
    console.error(e);
  }
};
String.prototype.howmany = function (str) {
  let num = this.match(new RegExp(str, "g"));
  if (!num) num = 0;
  else num = num.length;
  return num;
};
String.prototype.has = function (str) {
  let chk = true;
  if (this.indexOf(str) == -1) chk = false;
  return chk;
};
String.prototype.rm = function (sign) {
  return this.split(sign).join("");
};
Array.prototype.lo = function () {
  const idx = this.length - 1;
  return this[idx];
};

function LINEDETECTOR(letters) {
  //const log = logOpt ? console.log : () => {};

  // 횡분석이 끝나면
  // guessVertical 함수에 hLines 배열이 전달된다.
  // hLines는 empty horizontal line(EHL) 배열이다.

  Array.prototype.getAverageSizeWH = function () {
    let sumW = 0;
    let sumH = 0;
    this.forEach((vertices) => {
      const w = vertices[1].x - vertices[0].x + 1;
      const h = vertices[2].y - vertices[0].y + 1;
      sumW += w;
      sumH += h;
    });
    return { avgW: sumW / this.length, avgH: sumH / this.length };
  };
  Array.prototype.yCatch = function (min, max) {
    const res = [];
    this.forEach((vertices) => {
      const minmax = vertices.vnx();
      if (max == -1) {
        if (minmax.min.y >= min) res.push(vertices);
      } else {
        if (minmax.min.y >= min && minmax.min.y <= max) res.push(vertices);
      }
    });
    res.sort((a, b) => a[0].x - b[0].x);
    return res;
  };
  Array.prototype.hCatch = function (y) {
    const res = [];
    this.forEach((vertices) => {
      const minmax = vertices.vnx();
      if (y >= minmax.min.y && y <= minmax.max.y) res.push(vertices);
    });
    res.sort((a, b) => a[0].x - b[0].x);
    return res;
  };
  Array.prototype.vCatch = function (x, yMin, yMax) {
    //log(yMin, yMax);
    const res = [];
    this.forEach((vertices) => {
      const minmax = vertices.vnx();
      //우선 라인의 y 조건에 맞지 않는 객체들은 제외한다.
      if (minmax.min.y <= yMin || minmax.min.y >= yMax) return;
      if (x >= minmax.min.x && x <= minmax.max.x) res.push(vertices);
    });
    res.sort((a, b) => a[0].y - b[0].y);
    return res;
  };
  Array.prototype.vnx = function () {
    // vertices의 최대최소
    let res = {
      max: { x: null, y: null },
      min: { x: null, y: null },
    };
    this.forEach(({ x, y }, j) => {
      if (j == 0) {
        res = {
          max: { x, y },
          min: { x, y },
        };
        return;
      }
      if (x > res.max.x) res.max.x = x;
      if (x < res.min.x) res.min.x = x;

      if (y > res.max.y) res.max.y = y;
      if (y < res.min.y) res.min.y = y;
    });

    // minmax 정보를 바탕으로 한, 전체 박스 영역 정보를 파악한다.
    res.x = res.min.x;
    res.y = res.min.y;
    res.w = res.max.x - res.min.x + 1;
    res.h = res.max.y - res.min.y + 1;
    return res;
  };
  Array.prototype.minmax = function () {
    // arVertices의 최대최소
    let res = {
      max: { x: null, y: null },
      min: { x: null, y: null },
    };
    this.forEach((vertices, i) => {
      vertices.forEach(({ x, y }, j) => {
        if (i == 0 && j == 0) {
          res = {
            max: { x, y },
            min: { x, y },
          };
          return;
        }
        if (x > res.max.x) res.max.x = x;
        if (x < res.min.x) res.min.x = x;

        if (y > res.max.y) res.max.y = y;
        if (y < res.min.y) res.min.y = y;
      });
    });
    // minmax 정보를 바탕으로 한, 전체 박스 영역 정보를 파악한다.
    res.x = res.min.x;
    res.y = res.min.y;
    res.w = res.max.x - res.min.x + 1;
    res.h = res.max.y - res.min.y + 1;
    return res;
  };
  Array.prototype.getVerticesArray = function () {
    const res = [];
    this.forEach(({ vertices }) => res.push(vertices));
    return res;
  };
  Object.prototype.getVerticesArray = function () {
    let res = [];
    Object.entries(this).forEach(([, row]) => {
      Object.entries(row).forEach(([, col]) => {
        const { vertices } = col;
        if (vertices.length == 0) return;
        res = res.concat(vertices);
      });
    });
    return res;
  };

  const arVertices = letters.getVerticesArray();

  /* 
  인식한 글자의 좌표가 그 글자의 key가 되도록 해서 texts에 저장한다.
  vertice 배열에는 [{x:, y:},{x:, y:},{x:, y:},{x:, y:}] 와 같이 꼭지점의 좌표가 들어있다.
  좌표는 left top, right top, right bottom, left bottom 순이다.
  모든 글자들은 다른 좌표를 가질 것이므로(같은 좌표를 공유하는 것들은 같은 객체일 것이므로),
  좌표정보가 곧 key가 될 수 있다. 
  */
  const texts = (() => {
    const res = {};
    letters.forEach((letter) => {
      const key = JSON.stringify(letter.vertices);
      res[key] = letter.text;
    });
    return res;
  })();

  let LIMIT = 0;
  const root = {};
  const stack = [];
  mkString(arVertices, root, stack);

  return { root, stack };

  function getAverageSize(hLines) {
    const res = {};
    let prev;
    hLines.forEach((obj, idxLine) => {
      const { middle } = obj;
      if (prev == undefined)
        res[idxLine] = arVertices.yCatch(0, middle).getAverageSizeWH();
      else
        res[idxLine] = arVertices
          .yCatch(prev.middle, middle)
          .getAverageSizeWH();
      prev = obj;
    });
    res[hLines.length] = arVertices.yCatch(prev.middle, -1).getAverageSizeWH();
    return res;
  }
  function guessVertical(hLines) {
    //첫번째부터 끝라인까지의 분석
    const vLines = {};
    let prev;
    hLines.forEach((obj, idxLine) => {
      guessLine(obj, idxLine);
      prev = obj;
    });
    // 끝라인 이후의 공간에 대한 분석
    guessLine(undefined, hLines.length);
    return vLines;

    function guessLine(obj, idxLine) {
      const param = arVertices.minmax();
      const originX = param.x;
      const num = param.w;
      around(num, (i) => {
        param.x = originX + i;
        //라인과 라인 사이의 영역이 글자가 위치한 영역이다.
        let minY; //라인의 시작점
        let maxY; //라인의 끝점
        if (prev == undefined) {
          // 첫번째 라인
          minY = arVertices.minmax().y - 1; // 컨텐츠 area y이므로 반드시 1을 빼준다.
          maxY = obj.middle;
        } else if (obj == undefined) {
          //끝라인(마지막 라인 이후의 공간)
          minY = prev.middle;
          maxY = param.y + param.h;
        } else {
          //첫번째와 끝라인 중간의 모든 라인들
          minY = prev.middle;
          maxY = obj.middle;
        }
        if (arVertices.vCatch(param.x, minY, maxY).length == 0) {
          param.y = minY;
          param.h = maxY - minY;

          guessVLine(param, idxLine);
        }
      });

      vLines[idxLine] ??= [];
      vLines[idxLine].push({
        type: "vLine",
        min: param.x + param.h - 1,
        max: param.x + param.h - 1,
        weight: 100,
        middle: param.x + param.h - 1,
        startY: param.y,
        endY: param.h,
      });
    }
    function guessVLine(param, line) {
      //백지영역의 범위를 넓히는 함수
      const i = param.x;
      const obj = {
        type: "vLine",
        min: i,
        max: i,
        weight: 1, // 사실 weight는 max - min +1 이다.
        middle: i,
        startY: param.y,
        endY: param.h, // 라인의 높이를 나타내기 때문에 좌표를 지정하면 안 된다(길이만 지정한다).
      };
      vLines[line] ??= [];
      const startY = param.y;
      const endY = param.h;

      let flg = true;
      vLines[line].forEach((ob) => {
        if (i == ob.min - 1) {
          ob.min = i;
          ob.weight++; // 사실 weight는 max - min +1 이다.
          ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
          flg = false;
        } else if (i == ob.max + 1) {
          ob.max = i;
          ob.weight++; // 사실 weight는 max - min +1 이다.
          ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
          flg = false;
        }
      });
      if (flg) {
        vLines[line].push(obj);
      }
    }
  }
  function guessHorizontal(arVertices) {
    // object들의 vertices 정보를 바탕으로 모든 object들을 포괄하는
    // 전체영역 박스 좌표를 생성한다.
    const param = arVertices.minmax();
    const hLines = [];

    //let probe = reprod.hline(param, "red");
    const originY = param.y;
    const num = param.h;
    around(num, (i) => {
      param.y = originY + i;
      //probe = reprod.hline(param, "red", probe);

      // 조건문은 object가 존재하지 않는 empty horizontal line(EHL)을 발견한 것이고,
      // guessHLine은 그게 이전의 EHL과 연속인지 파악하고, 연속이면 하나의 객체로 통합하는 과정이다.
      if (arVertices.hCatch(param.y).length == 0) guessHLine(param);
    });
    return hLines;

    function guessHLine(param) {
      //empty horizontal line(EHL)의 범위를 넓히는 함수
      const i = param.y;
      // EHL의 자료구조
      const hLine = {
        type: "hLine",
        min: i,
        max: i,
        weight: 1,
        middle: i,
        startX: param.x,
        endX: param.w,
      };
      let flg = true;

      hLines.forEach((ob) => {
        if (i == ob.min - 1) {
          ob.min = i;
          ob.weight++; // 사실 weight는 max - min +1 이다.
          ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
          flg = false;
        } else if (i == ob.max + 1) {
          ob.max = i;
          ob.weight++; // 사실 weight는 max - min +1 이다.
          ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
          flg = false;
        }
      });
      if (flg) hLines.push(hLine);
    }
  }
  function getColsByLine(hLines, vLines, avgLines) {
    // 라인과 라인 사이, 즉 row의 영역을 구한다.
    const rows = {};
    let prev;
    hLines.forEach((line, i) => {
      if (i == 0) {
        rows[i] = {
          type: "row",
          id: i,
          min: 0,
          max: line.middle - 1,
        };
        prev = line;
        return;
      }

      rows[i] = {
        type: "row",
        id: i,
        min: prev.middle + 1,
        max: line.middle - 1,
      };

      prev = line;
    });
    rows[hLines.length] = {
      type: "row",
      id: hLines.length,
      min: prev.middle + 1,
      max: -1,
    };
    //컬럼 area를 뽑아본다.
    const obCols = {};
    Object.entries(vLines).forEach(([key, val], i) => {
      const space = avgLines[key].avgW;
      let cPrev;
      val.forEach((ob) => {
        if (ob.weight < space) return;
        obCols[key] ??= [];
        if (cPrev == undefined) {
          obCols[key].push({
            type: "col",
            min: 0,
            max: ob.middle - 1,
          });
          cPrev = ob;
          return;
        }
        obCols[key].push({
          type: "col",
          min: cPrev.middle + 1,
          max: ob.middle - 1,
        });
        cPrev = ob;
      });

      // column line 이 하나도 없을 때는
      // 전체를 하나의 column으로 해서 리턴한다.
      if (cPrev == undefined) return;

      obCols[key] ??= [];
      obCols[key].push({
        type: "col",
        min: cPrev.middle + 1,
        max: -1,
      });
    });

    // row / col 정보를 본다.
    const colsByLine = {};
    Object.entries(obCols).forEach(([key, cols], i) => {
      const { min: min_y, max: max_y } = rows[key];
      cols.forEach((col, j) => {
        const { min: min_x, max: max_x } = col;
        colsByLine[key] ??= [];
        colsByLine[key].push({
          min_x,
          min_y,
          max_x,
          max_y,
        });
      });
    });

    return { rows, colsByLine };
  }
  function getObjectsByLine(arVertices) {
    const hLines = guessHorizontal(arVertices);
    if (hLines.length == 0) return { hLines };
    const avgLines = getAverageSize(hLines);
    const vLines = guessVertical(hLines);
    const { rows, colsByLine } = getColsByLine(hLines, vLines, avgLines);
    // 라인들을 횡분석, 종분석 방법으로 찾는다.
    // 라인을 먼저 찾고,
    // 라인별로 횡분석을 실시한다.
    //const { hLines, vLines, rows, colsByLine, avgLines } = guess(arVertices);
    // 횡라인과 종라인을 표시한다.
    /* dpHLines(hLines);
    Object.entries(vLines).forEach(([key, val]) => {
      dpVLines(vLines, key, avgLines[key].avgW);
    }); */

    // 특정 row에 해당하는 object들을 구한다.
    const objectsByLine = {};
    Object.entries(rows).forEach(([, row]) => {
      arVertices.forEach((vertices) => {
        const [{ x, y }] = vertices;
        if (y >= row.min) {
          if (row.max == -1) {
            // 맨 끝행일때,
            objectsByLine[row.id] ??= [];
            objectsByLine[row.id].push(vertices);
            return;
          }
          if (y <= row.max) {
            objectsByLine[row.id] ??= [];
            objectsByLine[row.id].push(vertices);
          }
        }
      });
    });

    // 특정 col에 있는 object들을 모은다.
    const columns = [];
    Object.entries(colsByLine).forEach(([key, cols], i) => {
      cols.forEach((col, j) => {
        arVertices.forEach((vertices) => {
          const [lt, , rb] = vertices;
          if (lt.x >= col.min_x && lt.y >= col.min_y) {
            if (col.max_x == -1) {
              if (rb.y <= col.max_y) {
                columns.push({
                  row: key,
                  col: j,
                  vertices,
                });
              }
            } else {
              if (rb.x <= col.max_x) {
                if (col.max_y == -1) {
                  columns.push({
                    row: key,
                    col: j,
                    vertices,
                  });
                } else if (rb.y <= col.max_y) {
                  columns.push({
                    row: key,
                    col: j,
                    vertices,
                  });
                }
              }
            }
          }
        });
      });
    });

    const objectsByColumn = {};
    Object.entries(colsByLine).forEach(([key, cols], i) => {
      objectsByColumn[key] ??= {};
      cols.forEach((col, j) => {
        objectsByColumn[key][j] ??= [];
        arVertices.forEach((vertices) => {
          const [lt, , rb] = vertices;
          if (lt.x >= col.min_x && lt.y >= col.min_y) {
            if (col.max_x == -1) {
              if (rb.y <= col.max_y) {
                objectsByColumn[key][j].push(vertices);
              }
            } else {
              if (rb.x <= col.max_x) {
                if (col.max_y == -1) {
                  objectsByColumn[key][j].push(vertices);
                } else if (rb.y <= col.max_y) {
                  objectsByColumn[key][j].push(vertices);
                }
              }
            }
          }
        });
      });
    });
    return { objectsByLine, columns, objectsByColumn };
  }
  function recursiveGuess(param, parent) {
    // param은 arVertices, 즉 vertices를 담은 배열이다.
    // (vertices가 배열이므로, 2차원 배열이다)
    const { objectsByColumn } = getObjectsByLine(param);
    Object.entries(objectsByColumn).forEach(([key, val]) => {
      parent[key] ??= {};
      Object.entries(val).forEach(([colkey, col]) => {
        parent[key][colkey] ??= { vertices: col };
        const res = getObjectsByLine(col);
        if (res.hLines) return;
        if (res.columns.length == 0) return;

        parent[key][colkey].children = {};
        recursiveGuess(col, parent[key][colkey].children);
      });
    });
  }
  function mkString(arVertices, root, stack) {
    const guessRoot = {};
    recursiveGuess(arVertices, guessRoot);
    Object.entries(guessRoot).forEach(([rowkey, cols]) => {
      root[rowkey] ??= {};
      Object.entries(cols).forEach(([colkey, col]) => {
        if (col.vertices.length == 0) return;

        if (col.children) {
          // cell(즉, col)에 children이 있다는 말은
          // 그 자체로 또 하나의 테이블 형태를 이루고 있다는 말이다.
          // 내부에 row(= line) / col(= cell) 이 다시 존재한다.
          // 따라서 문자열을 만들기 위해서는 이 함수를 재귀적으로 호출해야 한다.

          // step 1. 결과를 담기 위한 root object를 정의한다.
          root[rowkey][colkey] ??= { children: {} };
          // step 2. 탐색을 위한 arVertices 자료를 생성한다.
          let arChildrenVertices = col.children.getVerticesArray();
          // step 3. 두개의 파라미터 생성(arVertices & root object)이 완료되었으므로, 재귀호출한다.
          mkString(arChildrenVertices, root[rowkey][colkey].children, stack);
          return;
        }

        // normal cell인 경우는 text를 출력한다.
        const vtt = verticesToText(col.vertices);
        root[rowkey][colkey] = vtt;
        stack.push(vtt);
      });
    });
  }
  function verticesToText(arVertices) {
    // ar에는 vertices 배열이 들어 있다.
    // vertice 배열에는 [{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0}] 와 같이 꼭지점의 좌표가 들어있다.
    // 좌표는 left top, right top, right bottom, left bottom 순이다.
    const str = [];
    arVertices.forEach((vertices) => {
      const key = JSON.stringify(vertices);
      str.push(texts[key]);
    });
    return { text: str.join(""), xywh: arVertices.minmax() };
  }
}

function procPost(req, response, data, files) {
  log("request url", req.url);
  log("data");
  dir(data);

  let url;
  let script;
  const reqUrl = "/" + req.url.split("/").lo();

  if (reqUrl == "/dummy") {
    const { file } = files;
    const { size, filepath, newFilename, mimetype, mtime, originalFilename } =
      file;
    const currentFile = "temp/" + newFilename;
    const objResp = { type: "okay" };
    response.write(JSON.stringify(objResp));
    response.end();
  } else if (reqUrl == "/feedback") {
    const { checksum } = data;
    const objResp = {
      checksum,
      type: "feedback",
    };
    response.write(JSON.stringify(objResp));
    response.end();
  } else if (reqUrl == "/detect") {
    const { file } = files;
    const { size, filepath, newFilename, mimetype, mtime, originalFilename } =
      file;
    const currentFile = "temp/" + newFilename;
    getChecksum(currentFile, (checksum) => {
      const addr = "temp/" + checksum + ".json";
      const chk = fs.existsSync(addr);
      if (chk) {
        fs.unlinkSync(currentFile);
        const objResp = fs.readFileSync(addr, "utf-8").jp();
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
          const { blockType, confidence, property, boundingBox, paragraphs } =
            ob;
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

        const { root, stack: detectedCells } = LINEDETECTOR(letters);
        const dc = detectedCells;
        let detectedResult;
        /* if (dc && dc[0] && dc[0][0]) {
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
        } */

        const objResp = {
          detectedCells,
          letters,
          checksum,
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
  } else if (reqUrl == "/getKakaoToken") {
    const { code } = data;
    log("code> ", code);
    const options = {
      url: "https://kauth.kakao.com/oauth/token",
      method: "POST",
      form: {
        grant_type: "authorization_code",
        client_id: "3bf6acdeeb89174cd24537e4f0aaaedb",
        code,
      },
    };
    log("options>", options);

    request(options, (error, resp, body) => {
      const objResp = { body };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/babybell") {
    const { step } = data;
    const objResp = { result: `단계 ${step}, 전송되었습니다.` };
    response.write(JSON.stringify({}));
    response.end();
  }
}

const server = http
  .createServer((request, response) => {
    log("http request", request.method);
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

    if (
      request.headers["content-type"] &&
      request.headers["content-type"].indexOf("multipart/form-data") != -1
    ) {
      // 파일처리이므로 formidable을 이용한다.
      var form = new formidable.IncomingForm({
        uploadDir: fileUploadDir,
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
        // log("test", chunk.toString());
        body.push(chunk.toString());
      })
      .on("end", () => {
        let data;
        data = body.join("");
        try {
          log(data);
          data = JSON.parse(data);
        } catch (e) {
          log(e);
          log(data);
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
