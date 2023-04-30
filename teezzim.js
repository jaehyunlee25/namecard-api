const http = require("http");
const mysql = require("mysql");
const fs = require("fs");
const ogs = require("open-graph-scraper");
const formidable = require("formidable");
const crypto = require("crypto");
const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({
  keyFilename: "keyfile.json",
});
const log = function () {
  console.log("\n\n>> new log :: ", new Date());
  console.log(Array.from(arguments).join(", "));
};
const dir = function (arg) {
  console.log("\n\n>> new dir :: ", new Date());
  console.dir(arg);
};

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
global.around = function (lmt, fnc) {
  for (var i = 0; i < lmt; i++) {
    var a = fnc(i);
    if (a) break;
  }
};

let golfClubEngNames = [];
let golfClubIdToEng = {};
let golfClubEngToKor = {};
let golfClubIds = {};
let golfClubLoginUrl = {};
let golfClubLoginUrlByUUID = {};
let golfClubSearchUrl = {};
let golfClubReserveUrl = {};
let golfClubAccounts = {};
let golfCourseByEngId = {};
let golfCourseByUUID = {};
let golfClubLoginProc = {};
let golfClubs = {};
let golfCourses = {};
let golfClubGroups = {};
let groupClubs = {};
let LINE_DIVISION = "\n/* <============line_div==========> */\n";
let ENV = ".env".gfjp();
let golfLinks = {};

"sql/getGolfClub.sql".gf().query(getGolfClub);
"sql/getGolfCourse.sql".gf().query(getGolfCourse);
"sql/golfClubNames.sql".gf().query(getClubNames);
"sql/getLoginUrl.sql".gf().query(getLoginUrl);
"sql/getSearchUrl.sql".gf().query(getSearchUrl);
"sql/getReserveUrl.sql".gf().query(getReserveUrl);
"sql/getAccount.sql".gf().query(getAccounts);
"sql/golf_course.sql".gf().query(getGolfCourses);
"sql/proc_login.sql".gf().query(getProcLogins);
"sql/getGolfClubGroup.sql".gf().query(getGolfClubGroup);

DATACOLLECT();
setInterval(DATACOLLECT, 1000 * 60);

function DATACOLLECT() {
  log("DATACOLLECT");
  "sql/getGolfLink.sql".gfdp({ section: "" }).query(getGolfLink);
}
function getGolfLink(err, rows, fields) {
  rows.forEach((row) => {
    golfLinks[row.eng_id] = row;
  });
}
function getGolfClubGroup(err, rows, fields) {
  rows.forEach((row) => {
    groupClubs[row.golf_club_id] = row.name;
    if (!golfClubGroups[row.name]) golfClubGroups[row.name] = [];
    golfClubGroups[row.name].push(row);
  });
}
function getGolfClub(err, rows, fields) {
  rows.forEach((row) => {
    golfClubs[row.id] = row;
  });
}
function getGolfCourse(err, rows, fields) {
  rows.forEach((row) => {
    if (!golfCourses[row.golf_club_id]) golfCourses[row.golf_club_id] = {};
    golfCourses[row.golf_club_id][row.name] = row;
  });
}
function getProcLogins(err, rows, fields) {
  rows.forEach((row) => {
    golfClubLoginProc[row.id] = {
      result: row.result,
      proc: row.proc,
      message: row.message,
      landingLink: row.landing_link,
    };
  });
}
function getGolfCourses(err, rows, fields) {
  rows.forEach((row) => {
    if (!golfCourseByEngId[row.golf_club_english_name])
      golfCourseByEngId[row.golf_club_english_name] = [];
    golfCourseByEngId[row.golf_club_english_name].push(row);

    if (!golfCourseByUUID[row.golf_club_id])
      golfCourseByUUID[row.golf_club_id] = [];
    golfCourseByUUID[row.golf_club_id].push(row);
  });
}
function getAccounts(err, rows, fields) {
  rows.forEach((row) => {
    golfClubAccounts[row.golf_club_english_name] = {
      id: row.golf_club_login_url_admin_id,
      pw: row.golf_club_login_url_admin_pw,
    };
  });
  // console.log(golfClubAccounts);
}
function getClubNames(err, rows, fields) {
  if (err) log(err);
  rows.forEach((row) => {
    golfClubEngNames.push(row.eng_id);
    golfClubIds[row.eng_id] = row.golf_club_id;
    golfClubIdToEng[row.golf_club_id] = row.eng_id;
    golfClubEngToKor[row.eng_id] = row.name;
    // console.log(row.eng_id);
    // if(row.eng_id != "allday") fs.writeFileSync("script/search/" + row.eng_id + ".js", "");
  });
  // console.log(golfClubIds);
}
function getLoginUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubLoginUrl[row.golf_club_english_name] =
      row.golf_club_login_url_mobile;
    golfClubLoginUrlByUUID[row.golf_club_uuid] = row.golf_club_login_url_mobile;
  });
  // console.log(golfClubLoginUrl);
}
function getSearchUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubSearchUrl[row.golf_club_english_name] =
      row.golf_club_search_url_mobile;
  });
  // console.log(golfClubSearchUrl);
}
function getReserveUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubReserveUrl[row.golf_club_english_name] =
      row.golf_club_search_url_mobile;
  });
}
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

  const arVertices = letters.getVerticesArray();
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
  mkString(arVertices, root);

  return root;

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
  function mkString(arVertices, root) {
    const guessRoot = {};
    recursiveGuess(arVertices, guessRoot);
    Object.entries(guessRoot).forEach(([key, cols]) => {
      root[key] ??= {};
      Object.entries(cols).forEach(([colkey, col]) => {
        if (col.vertices.length == 0) return;
        root[key][colkey] ??= {};
        if (col.children) {
          root[key][colkey].children = {};
          let tmp = [];
          Object.entries(col.children).forEach(([key, line]) => {
            Object.entries(line).forEach(([linekey, col]) => {
              const { vertices } = col;
              if (vertices.length == 0) return;
              tmp = tmp.concat(vertices);
            });
          });
          mkString(tmp, root[key][colkey].children);
          return;
        }
        root[key][colkey].text = verticesToText(col.vertices);
      });
    });
  }
  function verticesToText(ar) {
    const str = [];
    ar.forEach((vertices) => {
      const key = JSON.stringify(vertices);
      str.push(texts[key]);
    });
    return str.join("");
  }
}

function procPost(request, response, data, files) {
  log("request url", request.url);
  log("data", data);
  if (data.club && !golfClubAccounts[data.club]) {
    response.write(
      JSON.stringify({
        url: "",
        script: "",
      })
    );
    response.end();
    return;
  }

  let url;
  let script;
  let objResp;
  const reqUrl = "/" + request.url.split("/").lo();

  if (reqUrl == "/dummy") {
  } else if (reqUrl == "/account") {
    objResp = {
      accounts: golfClubAccounts,
    };
  } else if (reqUrl == "/clubGroup") {
    const club = data.club_id;
    const groupName = groupClubs[club];
    let result = [];
    if (groupName) result = golfClubGroups[groupName];
    objResp = {
      resultCode: 1,
      message: "OK",
      data: result,
    };
  } else if (reqUrl == "/clubs") {
    const result = [];
    const clubIds = {};
    const clubStates = {};
    getClubs((rows) => {
      rows.forEach((row) => {
        result.push(row.eng_id);
        clubIds[row.eng_id] = row.id;
        clubStates[row.eng_id] = row.golf_club_state;
      });
      objResp = {
        clubs: result,
        clubIds,
        clubStates,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
    objResp = 0;
  } else if (reqUrl == "/control") {
    /*
      controlForUserDevice(engName, "");
      */
    const engName = data.club;
    const sql = "sql/getDeviceByClub.sql".gfdp({ engName });
    sql.query((err, rows, fields) => {
      if (rows.length === 0) {
        controlForAdminDevice(engName);
      } else {
        const top = rows[0];
        const std = new Date() - top.created_at;
        const m5 = 1000 * 60 * 5;
        if (std > m5) controlForAdminDevice(engName);
        else controlForUserDevice(engName, top.token);
      }
    });

    objResp = {};
  } else if (reqUrl == "/dbCheckGolfClubEngName") {
    "sql/getDbCheckGolfClubEngName.sql"
      .gfdp(data)
      .query((err, rows, fields) => {
        if (err) {
          objResp = {
            type: "error",
            data: err,
          };
        } else {
          objResp = {
            type: "okay",
            data: rows,
          };
        }
        response.write(JSON.stringify(objResp));
        response.end();
      });
  } else if (reqUrl == "/dbCheckGolfClubName") {
    "sql/getDbCheckGolfClubName.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
      } else {
        objResp = {
          type: "okay",
          data: rows,
        };
      }
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/dbCheckServerfile") {
    const eng = data.eng_id;
    objResp = {
      type: "okay",
      data: { check: false },
    };
    if (fs.existsSync("script/search_dict/" + eng + ".json"))
      objResp.data.check = true;
  } else if (reqUrl == "/dbGetGolfClub") {
    "sql/getGolfClub.sql".gf().query((err, rows, fields) => {
      golfClubs = {};
      rows.forEach((row) => {
        golfClubs[row.id] = row;
        golfClubs[row.id].eng_id = golfClubIdToEng[row.id];
        golfClubs[row.id].course_name = golfCourses[row.id]
          ? Object.keys(golfCourses[row.id]).join(",")
          : "";
      });
      objResp = {
        type: "okay",
        golfClubs,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/dbGetGroup") {
    objResp = {
      type: "okay",
      data: groupClubs,
    };
  } else if (reqUrl == "/dbNewGolfClub") {
    "sql/newDbGolfClub.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
        response.write(JSON.stringify(objResp));
        response.end();
        return;
      }
      "sql/getGolfClubRaw.sql".gf().query((err, rows, fields) => {
        const clubs = {};
        rows.forEach((row) => {
          clubs[row.id] = row;
        });
        objResp = {
          type: "okay",
          data: clubs,
        };
        response.write(JSON.stringify(objResp));
        response.end();
      });
    });
  } else if (reqUrl == "/dbNewGolfClubDetail") {
    "sql/newDbGolfClubDetail.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
        response.write(JSON.stringify(objResp));
        response.end();
        return;
      }
      objResp = {
        type: "okay",
        data: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/dbNewGolfClubEng") {
    "sql/newDbGolfClubEng.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
      } else {
        objResp = {
          type: "okay",
          data: rows,
        };
      }
      response.write(JSON.stringify(objResp));
      response.end();
      "sql/golfClubNames.sql".gf().query((err, rows, fields) => {
        golfClubEngNames = [];
        golfClubIds = {};
        golfClubIdToEng = {};
        golfClubEngToKor = {};
        rows.forEach((row) => {
          golfClubEngNames.push(row.eng_id);
          golfClubIds[row.eng_id] = row.golf_club_id;
          golfClubIdToEng[row.golf_club_id] = row.eng_id;
          golfClubEngToKor[row.eng_id] = row.name;
        });
      });
    });
  } else if (reqUrl == "/dbNewGolfClubOrder") {
    "sql/newDbGolfClubOrder.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
        response.write(JSON.stringify(objResp));
        response.end();
        return;
      }
      objResp = {
        type: "okay",
        data: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/dbNewGolfClubUsability") {
    "sql/newDbGolfClubUsability.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
        response.write(JSON.stringify(objResp));
        response.end();
        return;
      }
      objResp = {
        type: "okay",
        data: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/dbNewGolfCourse") {
    const { course_name, id } = data;
    const arCourse = course_name.replace(/\s/g, "").split(",");
    const res = [];
    arCourse.forEach((name) => {
      let value = [
        "uuid()",
        "'" + id + "'",
        "'" + name + "'",
        "'9홀'",
        "now()",
        "now()",
      ].join(",");
      res.push("(" + value + ")");
    });
    const course_values = res.join(",");
    "sql/newDbGolfCourse.sql"
      .gfdp({ course_values })
      .query((err, rows, fields) => {
        if (err) {
          objResp = {
            type: "error",
            data: err,
          };
        } else {
          objResp = {
            type: "okay",
            data: rows,
          };
        }
        response.write(JSON.stringify(objResp));
        response.end();
        "sql/getGolfCourse.sql".gf().query((err, rows, fields) => {
          golfCourses = {};
          rows.forEach((row) => {
            if (!golfCourses[row.golf_club_id])
              golfCourses[row.golf_club_id] = {};
            golfCourses[row.golf_club_id][row.name] = row;
          });
        });
      });
  } else if (reqUrl == "/dbNewGroup") {
    const { clubIds, engIds, groupName } = data;
    const res = [];
    clubIds.forEach((id, i) => {
      let value = [
        "'" + groupName + "'",
        "'" + id + "'",
        "'" + engIds[i] + "'",
      ].join(",");
      res.push("(" + value + ")");
    });
    const group_values = res.join(",");
    "sql/newDbGroup.sql".gfdp({ group_values }).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
      } else {
        objResp = {
          type: "okay",
          data: rows,
        };
      }
      response.write(JSON.stringify(objResp));
      response.end();
      "sql/getGolfClubGroup.sql".gf().query((err, rows, fields) => {
        golfClubGroups = {};
        groupClubs = {};
        rows.forEach((row) => {
          groupClubs[row.golf_club_id] = row.name;
          if (!golfClubGroups[row.name]) golfClubGroups[row.name] = [];
          golfClubGroups[row.name].push(row);
        });
      });
    });
  } else if (reqUrl == "/dbNewServerfile") {
    const { eng_id: eng } = data;
    const arRes = [
      ["login_url", golfClubLoginUrl[eng], "funcLogin"],
      ["search_url", golfClubSearchUrl[eng], "funcReserve"],
    ];
    const arObj = {
      LOGOUT:
        '  function LOGOUT() {\r\n    log("LOGOUT");\r\n    location.href="javascript:()=>{}";\r\n  }',
    };
    fs.writeFileSync(
      "script/search_dict/" + eng + ".json",
      JSON.stringify(arRes),
      "utf-8"
    );
    fs.writeFileSync(
      "script/search_logout/" + eng + ".json",
      JSON.stringify(arObj),
      "utf-8"
    );
    objResp = {
      type: "okay",
    };
  } else if (reqUrl == "/dbSetGolfClub") {
    "sql/setDbGolfClubOuterInfo.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          outer_type: "error",
          outer_data: err,
        };
      } else {
        objResp = {
          outer_type: "okay",
          outer_data: rows,
        };
      }
      "sql/setDbGolfClub.sql".gfdp(data).query((err, rows, fields) => {
        if (err) {
          objResp.type = "error";
          objResp.data = err;
        } else {
          objResp.type = "okay";
          objResp.data = rows;
        }
        response.write(JSON.stringify(objResp));
        response.end();
        "sql/getGolfClub.sql".gf().query((err, rows, fields) => {
          golfClubs = {};
          rows.forEach((row) => {
            golfClubs[row.id] = row;
          });
        });
      });
    });
  } else if (reqUrl == "/delDeviceRecord") {
    delDeviceDate(data, (res1) => {
      delDeviceTime(data, (res2) => {
        objResp = {
          resultCode: 200,
          message: "디바이스 자료를 모두 삭제했습니다.",
        };
        response.write(JSON.stringify(objResp));
        response.end();
      });
    });
  } else if (reqUrl == "/delDeviceRecordTime") {
    delDeviceTime(data, (res2) => {
      objResp = {
        resultCode: 200,
        message: "디바이스 타임 자료를 모두 삭제했습니다.",
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/delGolfClubEvent") {
    const { eventId } = data;
    "sql/delGolfClubEvent.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/delGolfFashion") {
    "sql/delGolfFashion.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/fileUploadTest") {
    const { file } = files;
    const { size, filepath, newFilename, mimetype, mtime, originalFilename } =
      file;
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
  } else if (reqUrl == "/getClubNames") {
    objResp = {
      golfClubEngToKor,
    };
  } else if (reqUrl == "/getDeviceRound") {
    const archivePath = "/var/www/html/teelog/";
    const logArchiveList = fs.readdirSync(archivePath);
    const dt = data.date.rm("-");
    let chk;
    logArchiveList.forEach((file) => {
      if (file.has(dt)) chk = file;
    });
    if (chk) {
      const con = fs.readFileSync(archivePath.add(chk), "utf-8").jp();
      const res = [];
      con.forEach((ob) => {
        if (ob.device_id == data.device_id && ob.golf_club_id.has("_log"))
          res.push(ob);
      });
      objResp = {
        type: "okay",
        data: res,
      };
    } else {
      "sql/getDeviceRound.sql".gfdp(data).query((err, rows, fields) => {
        if (err) {
          objResp = {
            type: "error",
            data: err,
          };
        } else {
          objResp = {
            type: "okay",
            data: rows,
          };
        }
        response.write(JSON.stringify(objResp));
        response.end();
      });
    }
  } else if (reqUrl == "/getFeeLink") {
    "sql/getFeeLink.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
      } else {
        objResp = {
          type: "okay",
          data: rows,
        };
      }
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getGolfClubEvent") {
    "sql/getGolfClubEvent.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getGolfFashion") {
    "sql/getGolfFashion.sql".gfdp(data).query((err, rows, fields) => {
      const addr =
        "https://mnemosynesolutions.co.kr/app/project/editor_source_golf/img/upload/";
      rows.forEach((row) => {
        row.thumbnail = addr + row.thumbnail;
      });
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getGolfGame") {
    "sql/getGolfGame.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getGolfGameScore") {
    "sql/getGolfGameScore.sql".gfdp(data).query((err, rows, fields) => {
      const res = {};
      rows.forEach((obj) => {
        if (!res[obj.game_id]) res[obj.game_id] = [];
        res[obj.game_id].push(obj);
      });
      objResp = stdSQLProc(err, res);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getGolfLessonMenu") {
    const menu = "template/golf/lesson.json".gfdp({});
    objResp = {
      result: "okay",
      data: menu,
    };
  } else if (reqUrl == "/getGolfLink") {
    if (data.section == undefined) data.section = "";
    "sql/getGolfLink.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getGolfLinkScript") {
    const commonScript = "script/link/common.js".gfdp(ENV);
    const { links, round } = data;
    const urls = [];
    const scripts = [];

    links.forEach((eng_id) => {
      const link_name = eng_id;
      const link = golfLinks[eng_id].link;
      const param = { link, link_name, commonScript, round };
      const file = "script/link/" + eng_id + ".js";
      urls.push(link);
      scripts.push(file.gfdp(param));
    });
    objResp = {
      links,
      urls,
      scripts,
    };
  } else if (reqUrl == "/getGolfNews") {
    "sql/getGolfNews.sql".gfdp({}).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      if (objResp.type == "okay") {
        const res = {};
        const result = { news: [], newsContents: [] };
        objResp.data.forEach((ob) => {
          const eng_id = ob.link_name;
          const name = golfLinks[ob.link_name].name;
          const id = golfLinks[ob.link_name].id;
          if (!res[eng_id])
            res[eng_id] = {
              eng_id,
              name,
              id,
              content: [],
            };
          ob.link_name = "[" + name + "]";
          result.newsContents.push(Object.assign({ eng_id, name }, ob));
          res[eng_id].content.push(ob);
        });
        Object.entries(res).forEach(([key, val]) => {
          result.news.push(val);
        });
        objResp.data = result;
      }
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getGolfYoutubeHotClip") {
    const list = "template/golf/hotclip.json".gfdp({});
    objResp = {
      result: "okay",
      data: list,
    };
  } else if (reqUrl == "/getLeaderBoardInfo") {
    const list = "template/golf/rank.json".gfjp();
    objResp = {
      result: "okay",
      data: list,
    };
  } else if (reqUrl == "/getLog") {
    const archivePath = "/var/www/html/teelog/";
    const logArchiveList = fs.readdirSync(archivePath);
    const dt = data.date.rm("-");
    let chk;
    logArchiveList.forEach((file) => {
      if (file.has(dt)) chk = file;
    });
    if (chk) {
      const con = fs.readFileSync(archivePath.add(chk), "utf-8").jp();
      const res = [];
      con.forEach((ob) => {
        if (
          ob.device_id == data.device_id &&
          ob.golf_club_id == data.golf_club_id
        )
          res.push(ob);
      });
      res.sort((a, b) => a.timestamp - b.timestamp);
      objResp = {
        type: "okay",
        data: res,
      };
    } else {
      "sql/getLog.sql".gfdp(data).query((err, rows, fields) => {
        if (err) {
          objResp = {
            type: "error",
            data: err,
          };
        } else {
          objResp = {
            type: "okay",
            data: rows,
          };
        }
        response.write(JSON.stringify(objResp));
        response.end();
      });
    }
  } else if (reqUrl == "/getLogClubList") {
    const archivePath = "/var/www/html/teelog/";
    const logArchiveList = fs.readdirSync(archivePath);
    const dt = data.date.rm("-");
    let chk;
    logArchiveList.forEach((file) => {
      if (file.has(dt)) chk = file;
    });
    if (chk) {
      const con = fs.readFileSync(archivePath.add(chk), "utf-8").jp();
      const dids = con.map((ob) => ob.golf_club_id);
      const arr = dids.filter((id, i) => dids.indexOf(id) === i);
      const res = [];
      arr.forEach((golf_club_id) => {
        res.push({ golf_club_id });
      });
      objResp = {
        type: "okay",
        data: res,
      };
    } else {
      "sql/getLogClubList.sql".gfdp(data).query((err, rows, fields) => {
        if (err) {
          objResp = {
            type: "error",
            data: err,
          };
        } else {
          objResp = {
            type: "okay",
            data: rows,
          };
        }
        response.write(JSON.stringify(objResp));
        response.end();
      });
    }
  } else if (reqUrl == "/getLogDeviceList") {
    const archivePath = "/var/www/html/teelog/";
    const logArchiveList = fs.readdirSync(archivePath);
    const dt = data.date.rm("-");
    let chk;
    logArchiveList.forEach((file) => {
      if (file.has(dt)) chk = file;
    });
    if (chk) {
      const con = fs.readFileSync(archivePath.add(chk), "utf-8").jp();
      const dids = con.map((ob) => ob.device_id);
      const arr = dids.filter((id, i) => dids.indexOf(id) === i);
      const res = [];
      arr.forEach((device_id) => {
        res.push({ device_id });
      });
      objResp = {
        type: "okay",
        data: res,
      };
    } else {
      "sql/getLogDeviceList.sql".gfdp(data).query((err, rows, fields) => {
        if (err) {
          objResp = {
            type: "error",
            data: err,
          };
        } else {
          objResp = {
            type: "okay",
            data: rows,
          };
        }
        response.write(JSON.stringify(objResp));
        response.end();
      });
    }
  } else if (reqUrl == "/getLogList") {
    const path = "/var/www/html/teelog";
    const files = fs.readdirSync(path);
    objResp = {
      result: "okay",
      data: files,
    };
  } else if (reqUrl == "/getLogReport") {
    "sql/getLogReport.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getMacroId") {
    "sql/getMacroId.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getOpenGraphInfo") {
    ogs({ url: data.url }).then((data) => {
      if (data.error) objResp = { result: "error", data: data.error };
      else objResp = { result: "okay", data: data.result };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getOuterInfo") {
    const { club_id: clubId } = data;
    "sql/getOuterInfo.sql".gfdp({ clubId }).query((err, rows, fields) => {
      if (err) console.log(err);
      objResp = {
        data: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getPenaltyLink") {
    "sql/getPenaltyLink.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
      } else {
        objResp = {
          type: "okay",
          data: rows,
        };
      }
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/getScheduleDetail") {
    log("test", data.result.length);
    const message = {
      GolfClub: golfClubs[data.golf_club_id],
      Game: [],
    };
    data.result.forEach((el) => {
      message.Game.push({
        game_date: el.date,
        game_time: el.time,
        GolfCourse: golfCourses[data.golf_club_id][el.course],
      });
    });
    objResp = {
      type: "okay",
      message,
    };
  } else if (reqUrl == "/getSettings") {
    const obj = "script/common/settings.json".gfjp();
    objResp = {
      type: "okay",
      settings: obj,
    };
  } else if (reqUrl == "/getWarning") {
    "sql/getWarning.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
      } else {
        objResp = {
          type: "okay",
          data: rows,
        };
      }
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/get_pure_login") {
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
  } else if (reqUrl == "/get_pure_search_core") {
    const engName = data.club;
    let core = "";
    const part = {
      mneCall: [],
      mneCallDetail: [],
      function: [],
      command: [],
    };
    try {
      core = fs.readFileSync("script/search_core/" + engName + ".js", "utf-8");
    } catch (e) {
      fs.writeFileSync(
        "script/search_core/" + engName + ".js",
        LINE_DIVISION + LINE_DIVISION + LINE_DIVISION
      );
      response.write(JSON.stringify({ core, part }));
      response.end();
      return;
    }
    if (core.indexOf(LINE_DIVISION) == -1) {
      const arr = core.split("\n");
      let cursor;
      arr.forEach((ln, i) => {
        if (ln.indexOf("function mneCallDetail") != -1) {
          cursor = part.mneCallDetail;
        } else if (ln.indexOf("function mneCall") != -1) {
          cursor = part.mneCall;
        } else if (
          part.mneCall.length > 0 &&
          part.mneCallDetail.length > 0 &&
          ln.indexOf("function ") == 0
        )
          cursor = part.function;
        else if (ln.length > 1 && ln[0] != " ") cursor = part.command;
        cursor.push(ln);
      });
      part.mneCall = part.mneCall.join("\n");
      part.mneCallDetail = part.mneCallDetail.join("\n");
      part.function = part.function.join("\n");
      part.command = part.command.join("\n");
    } else {
      const parts = core.split(LINE_DIVISION);
      [part.mneCall, part.mneCallDetail, part.function, part.command] = parts;
    }
    response.write(JSON.stringify({ core, part }));
    response.end();
  } else if (reqUrl == "/login") {
    const uuid = data.clubId;
    const engName = golfClubIdToEng[uuid];
    url = golfClubLoginUrl[engName];
    script = getLoginScript(engName);
    proc = golfClubLoginProc[uuid];
    objResp = {
      url,
      script,
      procProc: proc ? proc.proc : "",
      procResult: proc ? proc.result : "",
      procMessage: proc ? proc.message : "",
      procLandingLink: proc ? proc.landingLink : "",
    };
  } else if (reqUrl == "/loginScripts") {
    const ids = data.clubIds;
    const urls = {};
    const scripts = {};
    const procProcs = {};
    const procLandingLinks = {};
    const procMessages = {};
    const procResults = {};
    ids.forEach((uuid) => {
      const engName = golfClubIdToEng[uuid];
      urls[uuid] = golfClubLoginUrl[engName];
      scripts[uuid] = getLoginScript(engName);
      proc = golfClubLoginProc[uuid];
      procProcs[uuid] = proc ? proc.proc : {};
      procLandingLinks[uuid] = proc ? proc.landingLink : {};
      procMessages[uuid] = proc ? proc.message : {};
      procResults[uuid] = proc ? proc.result : {};
    });

    objResp = {
      urls,
      scripts,
      procProcs,
      procLandingLinks,
      procMessages,
      procResults,
    };
  } else if (reqUrl == "/login_admin") {
    const { club } = data;
    objResp = {
      url: golfClubLoginUrl[club],
      script: getLoginScriptAdmin(club),
    };
  } else if (reqUrl == "/login_link") {
    const { link_eng_id } = data;
    objResp = {
      url: golfLinks[link_eng_id].login_url,
      script: getLinkLoginScript(link_eng_id),
    };
  } else if (reqUrl == "/modGolfClubEvent") {
    "sql/modGolfClubEvent.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/modGolfFashion") {
    "sql/modGolfFashion.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/newGolfClubEvent") {
    "sql/newGolfClubEvent.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/newGolfFashion") {
    "sql/newGolfFashion.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/newGolfGame") {
    "sql/newGolfGame.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = stdSQLProc(err, rows);
        response.write(JSON.stringify(objResp));
        response.end();
        return;
      }
      "sql/getGolfGameID.sql".gfdp(data).query((err, rows, fields) => {
        objResp = stdSQLProc(err, rows[0]);
        response.write(JSON.stringify(objResp));
        response.end();
      });
    });
  } else if (reqUrl == "/newGolfGameScore") {
    "sql/newGolfGameScore.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/newGolfNews") {
    const { news } = data;
    const vls = [];
    news.forEach((ob) => {
      let {
        link_round: round,
        link_number: number,
        link_address: address,
        link_name: eng_id,
        link_content: content,
        link_datetime: datetime,
      } = ob;
      content = content.replace(/"/g, '\\"');
      const tpl = `(uuid(), "${round}", "${number}", "${address}", "${eng_id}", "${content}", "${datetime}", now(), now())`;
      log(tpl);
      vls.push(tpl);
    });
    const strValues = vls.join(",");
    "sql/newGolfNews.sql".gfdp({ strValues }).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/question") {
    "sql/setQuestion.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        console.log(err);
        objResp = {
          type: "error",
          data: err,
        };
      } else {
        objResp = {
          type: "okay",
          message: "성공적으로 접수되었습니다.",
        };
      }
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/reservebot") {
    objResp = reservebotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
      const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
      const loginUrl = golfClubLoginUrl[engName];
      const searchUrl = golfClubSearchUrl[engName];
      const reserveUrl = golfClubReserveUrl[engName];
      const loginScript = getPureLoginScript(engName);
      let templateScript;
      if (fs.existsSync("script/reserve/reserve/" + engName + ".js"))
        templateScript = fs.readFileSync(
          "script/reserve/reserve/" + engName + ".js",
          "utf-8"
        );
      else templateScript = fs.readFileSync("reserveTemplate.js", "utf-8");
      const script = templateScript.dp({
        year,
        month,
        date,
        course,
        time,
        commonScript,
        loginUrl,
        searchUrl,
        reserveUrl,
        loginScript,
      });
      objResp = {
        url: loginUrl,
        script,
      }; */
  } else if (reqUrl == "/reservebot_admin") {
    objResp = reservebotAdmin(data);
  } else if (reqUrl == "/reserveCancelbot") {
    objResp = reserveCancelbotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
      const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
      const loginUrl = golfClubLoginUrl[engName];
      const reserveUrl = golfClubReserveUrl[engName];
      const loginScript = getPureLoginScript(engName);
      let templateScript;
      if (fs.existsSync("script/reserve/cancel/" + engName + ".js"))
        templateScript = fs.readFileSync(
          "script/reserve/cancel/" + engName + ".js",
          "utf-8"
        );
      else
        templateScript = fs.readFileSync(
          "script/reserve/cancel/reserveCancelTemplate.js",
          "utf-8"
        );
      const golfClubId = golfClubIds[engName];
      const script = templateScript.dp({
        year,
        month,
        date,
        course,
        time,
        golfClubId,
        commonScript,
        loginUrl,
        reserveUrl,
        loginScript,
      });
      objResp = {
        url: loginUrl,
        script,
      }; */
  } else if (reqUrl == "/reserveCancelbot_admin") {
    objResp = reserveCancelbotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
      const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
      const loginUrl = golfClubLoginUrl[engName];
      const reserveUrl = golfClubReserveUrl[engName];
      const loginScript = getPureLoginScript(engName).dp({
        login_id: golfClubAccounts[engName].id,
        login_password: golfClubAccounts[engName].pw,
      });
      let templateScript;
      if (fs.existsSync("script/reserve/cancel/" + engName + ".js"))
        templateScript = fs.readFileSync(
          "script/reserve/cancel/" + engName + ".js",
          "utf-8"
        );
      else
        templateScript = fs.readFileSync(
          "script/reserve/cancel/reserveCancelTemplate.js",
          "utf-8"
        );
      const golfClubId = golfClubIds[engName];
      const script = templateScript.dp({
        year,
        month,
        date,
        course,
        time,
        golfClubId,
        commonScript,
        loginUrl,
        reserveUrl,
        loginScript,
      });
      objResp = {
        url: loginUrl,
        script,
      }; */
  } else if (reqUrl == "/reserveSearchbot") {
    objResp = reserveSearchbotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
      const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
      const loginUrl = golfClubLoginUrl[engName];
      const reserveUrl = golfClubReserveUrl[engName];
      const loginScript = getPureLoginScript(engName);
      let templateScript;
      if (fs.existsSync("script/reserve/search/" + engName + ".js"))
        templateScript = fs.readFileSync(
          "script/reserve/search/" + engName + ".js",
          "utf-8"
        );
      else
        templateScript = fs.readFileSync(
          "script/reserve/search/reserveSearchTemplate.js",
          "utf-8"
        );
      const golfClubId = golfClubIds[engName];
      const script = templateScript.dp({
        golfClubId,
        commonScript,
        loginUrl,
        reserveUrl,
        loginScript,
      });
      objResp = {
        url: loginUrl,
        script,
      }; */
  } else if (reqUrl == "/reserveSearchbots_admin") {
    const { clubs } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    clubs.forEach((club) => {
      const result = reserveSearchbotAdmin({ club });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };
  } else if (reqUrl == "/reserveSearchbot_admin") {
    objResp = reserveSearchbotAdmin(data);
  } else if (reqUrl == "/search") {
    console.log("url", reqUrl);
    const engName = data.club;
    const common = "script/common/common.js".gfdp(ENV);
    /* const clubscript = fs.readFileSync(
        "script/search/" + engName + ".js",
        "utf-8"
      ); */
    getSearchScript(engName, (clubscript) => {
      console.log(clubscript);
      const script = "javascript:(() => {" + common + clubscript + "})()";
      const url = golfClubSearchUrl[engName];
      objResp = {
        url,
        script,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/searchbot") {
    objResp = searchbot(data);
  } else if (reqUrl == "/searchbots_admin") {
    const { clubs } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    clubs.forEach((club) => {
      const result = searchbot({ club });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };
  } else if (reqUrl == "/searchbots_date") {
    const { clubs } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    const command = "GET_DATE";
    clubs.forEach((club) => {
      const result = searchbotDate({ club, command });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };
  } else if (reqUrl == "/searchbots_date_admin") {
    const { clubs } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    const command = "GET_DATE";
    clubs.forEach((club) => {
      const result = searchbotDateAdmin({ club, command });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };
  } else if (reqUrl == "/searchbots_time") {
    log("searchbots_time");
    const { clubs, date } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    const command = "GET_TIME";
    clubs.forEach((club) => {
      const result = searchbotTime({ club, command, date });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };
  } else if (reqUrl == "/searchbots_time_admin") {
    const { clubs, date } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    const command = "GET_TIME";
    clubs.forEach((club) => {
      const result = searchbotTimeAdmin({ club, command, date });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };
  } else if (reqUrl == "/searchbot_admin") {
    objResp = searchbot(data);
  } else if (reqUrl == "/search_core") {
    const engName = data.club;
    getSearchScript(engName, (script) => {
      const url = golfClubSearchUrl[engName];
      objResp = {
        url,
        script,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/setGolfClubState") {
    setGolfClubState(data, (rows) => {
      objResp = {
        resultCode: 200,
        message: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/setGolfGameScore") {
    "sql/setGolfGameScore.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/setReserveCancel") {
    objResp = setReserveCancel(data);
  } else if (reqUrl == "/setReserveReserve") {
    objResp = setReserveReserve(data);
  } else if (reqUrl == "/setReserveSearch") {
    objResp = setReserveSearch(data);
  } else if (reqUrl == "/setSurvey") {
    "sql/setSurvey.sql".gfdp(data).query((err, rows, fields) => {
      if (err) {
        objResp = {
          type: "error",
          data: err,
        };
      } else {
        objResp = {
          type: "okay",
          data: rows,
        };
      }
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (reqUrl == "/set_pure_login") {
    const { engName, core } = data;
    // backup first
    fs.writeFileSync(
      "script/backup/login_" + new Date().getTime() + "_" + engName + ".js",
      core
    );
    // file save
    fs.writeFileSync("script/login/" + engName + ".js", core);
    response.write(JSON.stringify({ resultCode: 200, result: "okay" }));
    response.end();
  } else if (reqUrl == "/set_pure_search_core") {
    const { club, part } = data;
    const engName = club;
    let core;
    try {
      console.log("read file");
      core = fs.readFileSync("script/search_core/" + engName + ".js", "utf-8");
    } catch (e) {
      console.log("error & read file");
      fs.writeFileSync(
        "script/search_core/" + engName + ".js",
        part.mneCall +
          LINE_DIVISION +
          part.mneCallDetail +
          LINE_DIVISION +
          part.function +
          LINE_DIVISION +
          part.command
      );
      response.write(JSON.stringify({ resultCode: 200, result: "okay" }));
      response.end();
      return;
    }

    console.log("backup");
    // backup first
    fs.writeFileSync(
      "script/backup/search_core_" +
        new Date().getTime() +
        "_" +
        engName +
        ".js",
      core
    );

    // file save
    fs.writeFileSync(
      "script/search_core/" + engName + ".js",
      part.mneCall +
        LINE_DIVISION +
        part.mneCallDetail +
        LINE_DIVISION +
        part.function +
        LINE_DIVISION +
        part.command
    );

    response.write(JSON.stringify({ resultCode: 200, result: "okay" }));
    response.end();
  } else {
    const engName = reqUrl.substring(1);
    url = golfClubLoginUrl[engName];
    script = getLoginScript(engName);
    objResp = {
      url,
      script,
    };
  }
  if (objResp) {
    // console.log("obj", objResp);
    response.write(JSON.stringify(objResp));
    response.end();
  }
}
function stdSQLProc(err, rows) {
  let objResp;
  if (err) {
    log(err);
    objResp = {
      type: "error",
      data: err,
    };
  } else {
    objResp = {
      type: "okay",
      data: rows,
    };
  }
  return objResp;
}
function delDeviceDate(data, callback) {
  /* const connection = mysql.createConnection("db.json".gfjp());
    connection.connect();
    connection.query(
      "sql/delDeviceDate.sql".gfdp(data),
      (err, rows, fields) => {
        if (err) callback(err);
        else callback(rows);
      }
    );
    connection.end(); */
  "sql/delDeviceDate.sql".gfdp(data).query((err, rows, fields) => {
    if (err) callback(err);
    else callback(rows);
  });
}
function delDeviceTime(data, callback) {
  /* const connection = mysql.createConnection("db.json".gfjp());
    connection.connect();
    connection.query(
      "sql/delDeviceTime.sql".gfdp(data),
      (err, rows, fields) => {
        if (err) callback(err);
        else callback(rows);
      }
    );
    connection.end(); */
  "sql/delDeviceTime.sql".gfdp(data).query((err, rows, fields) => {
    if (err) callback(err);
    else callback(rows);
  });
}
function getLog(callback) {
  const query = "select * from LOG order by id asc limit 1000;";
  query.query(callback);
}
function setGolfClubState(data, callback) {
  /* const connection = mysql.createConnection(
      JSON.parse(fs.readFileSync("db.json", "utf-8"))
    );
    connection.connect();
    connection.query(
      fs.readFileSync("sql/setGolfClubState.sql", "utf-8").dp(data),
      (err, rows, fields) => {
        if (err) callback(err);
        else callback(rows);
      }
    );
    connection.end(); */
  "sql/setGolfClubState.sql".gfdp(data).query((err, rows, fields) => {
    if (err) callback(err);
    else callback(rows);
  });
}
function setReserveCancel(data) {
  if (!fs.existsSync("script/reserve_core/cancel/" + data.club))
    fs.mkdirSync("script/reserve_core/cancel/" + data.club);

  /* dict file backup */
  const dictPath = "script/reserve_core/cancel/" + data.club + "/dict.json";
  if (fs.existsSync(dictPath)) {
    const con = fs.readFileSync(dictPath);
    const backupPath = "script/backup/reserve_cancel_dict_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dictPath, JSON.stringify(data.dict), "utf-8");

  /* funcs file backup */
  const funcPath = "script/reserve_core/cancel/" + data.club + "/funcs.json";
  if (fs.existsSync(funcPath)) {
    const con = fs.readFileSync(funcPath);
    const backupPath = "script/backup/reserve_cancel_funcs_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(funcPath, JSON.stringify(data.funcs), "utf-8");

  /* dictCourse file backup */
  const dcPath = "script/reserve_core/cancel/" + data.club + "/dictCourse.json";
  if (fs.existsSync(dcPath)) {
    const con = fs.readFileSync(dcPath);
    const backupPath = "script/backup/reserve_cancel_dictCourse_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dcPath, JSON.stringify(data.dictCourse), "utf-8");

  return {
    msg: "successfully saved!!",
    code: 200,
  };
}
function setReserveSearch(data) {
  if (!fs.existsSync("script/reserve_core/search/" + data.club))
    fs.mkdirSync("script/reserve_core/search/" + data.club);

  /* dict file backup */
  const dictPath = "script/reserve_core/search/" + data.club + "/dict.json";
  if (fs.existsSync(dictPath)) {
    const con = fs.readFileSync(dictPath);
    const backupPath = "script/backup/reserve_search_dict_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dictPath, JSON.stringify(data.dict), "utf-8");

  /* funcs file backup */
  const funcPath = "script/reserve_core/search/" + data.club + "/funcs.json";
  if (fs.existsSync(funcPath)) {
    const con = fs.readFileSync(funcPath);
    const backupPath = "script/backup/reserve_search_funcs_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(funcPath, JSON.stringify(data.funcs), "utf-8");

  /* dictCourse file backup */
  const dcPath = "script/reserve_core/search/" + data.club + "/dictCourse.json";
  if (fs.existsSync(dcPath)) {
    const con = fs.readFileSync(dcPath);
    const backupPath = "script/backup/reserve_search_dictCourse_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dcPath, JSON.stringify(data.dictCourse), "utf-8");

  return {
    msg: "successfully saved!!",
    code: 200,
  };
}
function setReserveReserve(data) {
  if (!fs.existsSync("script/reserve_core/reserve/" + data.club))
    fs.mkdirSync("script/reserve_core/reserve/" + data.club);

  /* dict file backup */
  const dictPath = "script/reserve_core/reserve/" + data.club + "/dict.json";
  if (fs.existsSync(dictPath)) {
    const con = fs.readFileSync(dictPath);
    const backupPath = "script/backup/reserve_reserve_dict_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dictPath, JSON.stringify(data.dict), "utf-8");

  /* funcs file backup */
  const funcPath = "script/reserve_core/reserve/" + data.club + "/funcs.json";
  if (funcPath) {
    const con = fs.readFileSync(funcPath);
    const backupPath = "script/backup/reserve_reserve_funcs_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(funcPath, JSON.stringify(data.funcs), "utf-8");

  /* dictCourse file backup */
  const dcPath =
    "script/reserve_core/reserve/" + data.club + "/dictCourse.json";
  if (fs.existsSync(dcPath)) {
    const con = fs.readFileSync(dcPath);
    const backupPath = "script/backup/reserve_reserve_dictCourse_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dcPath, JSON.stringify(data.dictCourse), "utf-8");

  /* splitterDate file backup */
  const sdPath = "script/reserve_core/reserve/" + data.club + "/splitterDate";
  if (sdPath) {
    const con = fs.readFileSync(sdPath);
    const backupPath = "script/backup/reserve_reserve_splitterDate_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(sdPath, data.splitterDate, "utf-8");

  return {
    msg: "successfully saved!!",
    code: 200,
  };
}
function reserveCancelbotAdmin(data) {
  const { club: engName, year, month, date, course, time } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const reserveUrl = golfClubReserveUrl[engName];
  const loginScript = getPureLoginScript(engName);

  let templateScript;
  if (fs.existsSync("script/reserve_core/cancel/" + engName)) {
    const tmpResult = ["javascript:(() => {"];
    const tmpCom = fs.readFileSync(
      "script/reserve_core/cancel/cancel_common.js",
      "utf-8"
    );
    /** dict */
    const conDict = fs.readFileSync(
      "script/reserve_core/cancel/" + engName + "/dict.json",
      "utf-8"
    );
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1] + '"', ar[2]].join(": "));
      });
      obj.push();
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDict);

    /** dictCourse */
    const conDictCourse = fs.readFileSync(
      "script/reserve_core/cancel/" + engName + "/dictCourse.json",
      "utf-8"
    );
    const reserve_course_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      Object.keys(json).forEach((key) => {
        obj.push(["  " + key, '"' + json[key].trim() + '"'].join(": "));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDictCourse);

    /** funcs */
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/cancel/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    if (!funcs.funcLogin) {
      if (fs.existsSync("script/reserve/cancel/" + engName + ".js")) {
        const oldFuncs = getFunc(
          fs.readFileSync("script/reserve/cancel/" + engName + ".js", "utf-8")
        );
        funcs.funcLogin = oldFuncs.funcLogin;
      } else {
        funcs.funcLogin = fs.readFileSync(
          "script/reserve_core/cancel/search_login.js",
          "utf-8"
        );
      }
    }
    tmpResult.push(tmpCom.dp({ address_mapping, reserve_course_mapping }));
    Object.keys(funcs).forEach((key) => {
      const func = funcs[key];
      tmpResult.push(func);
    });
    tmpResult.push("})();");
    templateScript = tmpResult.join("\r\n");
  } else {
    if (fs.existsSync("script/reserve/cancel/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/cancel/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve_core/cancel/template.js",
        "utf-8"
      );
  }
  const golfClubId = golfClubIds[engName];
  const script = templateScript.dp({
    golfClubId,
    commonScript,
    loginUrl,
    reserveUrl,
    loginScript,
  });
  return { url: reserveUrl, script };
}
function reserveSearchbotAdmin(data) {
  const { club: engName } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const reserveUrl = golfClubReserveUrl[engName];
  const loginScript = getPureLoginScript(engName);

  let templateScript;
  if (fs.existsSync("script/reserve_core/search/" + engName)) {
    const tmpResult = ["javascript:(() => {"];
    const tmpCom = fs.readFileSync(
      "script/reserve_core/search/search_common.js",
      "utf-8"
    );
    /** dict */
    const conDict = fs.readFileSync(
      "script/reserve_core/search/" + engName + "/dict.json",
      "utf-8"
    );
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1] + '"', ar[2]].join(": "));
      });
      obj.push();
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDict);

    /** dictCourse */
    const conDictCourse = fs.readFileSync(
      "script/reserve_core/search/" + engName + "/dictCourse.json",
      "utf-8"
    );
    const reserve_course_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      Object.keys(json).forEach((key) => {
        obj.push(["  " + key, '"' + json[key].trim() + '"'].join(": "));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDictCourse);

    /** funcs */
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/search/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    if (!funcs.funcLogin) {
      if (fs.existsSync("script/reserve/search/" + engName + ".js")) {
        const oldFuncs = getFunc(
          fs.readFileSync("script/reserve/search/" + engName + ".js", "utf-8")
        );
        funcs.funcLogin = oldFuncs.funcLogin;
      } else {
        funcs.funcLogin = fs.readFileSync(
          "script/reserve_core/search/search_login.js",
          "utf-8"
        );
      }
    }
    tmpResult.push(tmpCom.dp({ address_mapping, reserve_course_mapping }));
    Object.keys(funcs).forEach((key) => {
      const func = funcs[key];
      tmpResult.push(func);
    });
    tmpResult.push("})();");
    templateScript = tmpResult.join("\r\n");
  } else {
    if (fs.existsSync("script/reserve/search/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/search/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve_core/search/template.js",
        "utf-8"
      );
  }
  const golfClubId = golfClubIds[engName];
  const script = templateScript.dp({
    golfClubId,
    commonScript,
    loginUrl,
    reserveUrl,
    loginScript,
  });
  return { url: reserveUrl, script };
}
function reservebotAdmin(data) {
  const { club: engName, year, month, date, course, time } = data;
  const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const reserveUrl = golfClubReserveUrl[engName];
  const loginScript = getPureLoginScript(engName);

  let templateScript;
  if (fs.existsSync("script/reserve_core/reserve/" + engName)) {
    const tmpResult = ["javascript:(() => {"];
    const tmpCom = fs.readFileSync(
      "script/reserve_core/reserve/reserve_common.js",
      "utf-8"
    );
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1] + '"', ar[2]].join(": "));
      });
      obj.push();
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/dict.json",
        "utf-8"
      )
    );
    const reserve_course_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      Object.keys(json).forEach((key) => {
        obj.push(["  " + key, '"' + json[key].trim() + '"'].join(": "));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/dictCourse.json",
        "utf-8"
      )
    );
    const splitter_date = fs.readFileSync(
      "script/reserve_core/reserve/" + engName + "/splitterDate",
      "utf-8"
    );
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    if (!funcs.funcLogin) {
      if (fs.existsSync("script/reserve/reserve/" + engName + ".js")) {
        const oldFuncs = getFunc(
          fs.readFileSync("script/reserve/reserve/" + engName + ".js", "utf-8")
        );
        funcs.funcLogin = oldFuncs.funcLogin;
      } else {
        funcs.funcLogin = fs.readFileSync(
          "script/reserve_core/reserve/reserve_login.js",
          "utf-8"
        );
      }
    }
    tmpResult.push(
      tmpCom.dp({ address_mapping, reserve_course_mapping, splitter_date })
    );
    Object.keys(funcs).forEach((key) => {
      const func = funcs[key];
      tmpResult.push(func);
    });
    tmpResult.push("})();");
    templateScript = tmpResult.join("\r\n");
  } else {
    if (fs.existsSync("script/reserve/reserve/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/reserve/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve_core/reserve/template.js",
        "utf-8"
      );
  }
  const script = templateScript.dp({
    year,
    month,
    date,
    course,
    time,
    commonScript,
    loginUrl,
    searchUrl,
    reserveUrl,
    loginScript,
  });
  return { url: loginUrl, script };
}
function searchbotTime(data) {
  const { club: engName, command, date: TARGET_DATE } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const loginScript = getLoginScript(engName, true);
  const templateScript = fs.readFileSync("template.js", "utf-8");
  const searchScript = getSearchScript(engName, command).dp({ TARGET_DATE });
  const script = templateScript.dp({
    commonScript,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: loginUrl,
    script,
  };

  return objResp;
}
function searchbotTimeAdmin(data) {
  const { club, command, date: TARGET_DATE } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[club];
  const searchUrl = golfClubSearchUrl[club];
  const loginScript = gf("script/login/" + club + ".js")
    .split("\r\n")
    .join("\r\n    ");
  // step 2: url 정보
  const urls = ("script/search_dict/" + club + ".json").gfjp();
  const objUrl = [];
  urls.forEach(([, url, func]) => {
    if (
      [
        "funcLogin",
        "funcSearch",
        "funcReserve",
        "funcCalendar",
        "funcOut",
        "funcLogout",
        "funcProcEnd",
        "funcPopLogin",
        "funcMain",
        "funcMove",
      ].indexOf(func) == -1
    )
      return;
    objUrl.push('"' + url + '": ' + func);
  });
  const address_mapping = "{" + objUrl.join(",") + "}";
  const templateScript = gf("template/search/template.js");
  let { searchCommonScript, searchScript } = getSearchScriptAdmin(
    club,
    command
  );
  searchCommonScript = searchCommonScript.dp({ TARGET_DATE });
  const script = templateScript.dp({
    commonScript,
    searchCommonScript,
    address_mapping,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: searchUrl,
    script,
  };

  return objResp;
}
function searchbotDateAdmin(data) {
  const { club, command } = data;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[club];
  const searchUrl = golfClubSearchUrl[club];
  const loginScript = gf("script/login/" + club + ".js")
    .split("\r\n")
    .join("\r\n    ");
  // step 2: url 정보
  const urls = ("script/search_dict/" + club + ".json").gfjp();
  const objUrl = [];
  urls.forEach(([, url, func]) => {
    if (
      [
        "funcLogin",
        "funcSearch",
        "funcReserve",
        "funcCalendar",
        "funcOut",
        "funcLogout",
        "funcProcEnd",
        "funcPopLogin",
        "funcMain",
        "funcMove",
      ].indexOf(func) == -1
    )
      return;
    objUrl.push('"' + url + '": ' + func);
  });
  const address_mapping = "{" + objUrl.join(",") + "}";
  const templateScript = gf("template/search/template.js");
  const { searchCommonScript, searchScript } = getSearchScriptAdmin(
    club,
    command
  );
  const script = templateScript.dp({
    commonScript,
    searchCommonScript,
    address_mapping,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: searchUrl,
    script,
  };

  return objResp;
}
function searchbotDate(data) {
  const engName = data.club;
  const command = data.command;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const loginScript = getLoginScript(engName, true);
  const templateScript = fs.readFileSync("template.js", "utf-8");
  const searchScript = getSearchScript(engName, command);
  const script = templateScript.dp({
    commonScript,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: loginUrl,
    script,
  };

  return objResp;
}
function searchbot(data) {
  const engName = data.club;
  const commonScript = "script/common/common.js".gfdp(ENV);
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const loginScript = getLoginScript(engName, true);
  const templateScript = fs.readFileSync("template.js", "utf-8");
  const searchScript = getSearchScript(engName);
  const script = templateScript.dp({
    commonScript,
    loginUrl,
    searchUrl,
    loginScript,
    searchScript,
  });
  objResp = {
    url: loginUrl,
    script,
  };

  return objResp;

  /* const engName = data.club;
    const commonScript = fs.readFileSync("script/common/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const searchUrl = golfClubSearchUrl[engName];
    const loginScript = getPureLoginScript(engName);
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1], ar[2]].join('": '));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/dict.json",
        "utf-8"
      )
    );
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    const endoutScript = [funcs.funcEnd, funcs.LOGOUT].join("\r\n");
    const templateScript = fs.readFileSync("template.js", "utf-8");
    getSearchScript(engName, (searchScript) => {
      const script = templateScript.dp({
        commonScript,
        loginUrl,
        searchUrl,
        loginScript,
        searchScript,
        address_mapping,
        endoutScript,
      });
      objResp = {
        url: loginUrl,
        script,
      };
      callback(objResp);    
    }); */
}
function getFunc(code) {
  code = code.split("\r\n").join("\n");
  code = code.split("\n").join("\r\n");
  let pCount = 0;
  const funcs = {};
  const resEls = [];
  let curFunc = "";
  code.split("\r\n").forEach((ln) => {
    const regex = /\s?function\s([a-zA-Z]+)\s?\(/;
    const res = regex.exec(ln);
    if (!pCount && res) {
      curFunc = res[1];
      funcs[curFunc] = [ln];

      let plus = ln.howmany("{");
      let minus = ln.howmany("}");

      pCount += plus - minus;

      return;
    }
    if (pCount) {
      funcs[curFunc].push(ln);

      let plus = ln.howmany("{");
      let minus = ln.howmany("}");

      pCount += plus - minus;
      return;
    }
    resEls.push(ln);
  });
  Object.keys(funcs).forEach((key) => {
    const func = funcs[key];
    funcs[key] = func.join("\r\n");
  });
  return funcs;
}
function getClubs(callback) {
  /* const connection = mysql.createConnection(
      JSON.parse(fs.readFileSync("db.json", "utf-8"))
    );
    connection.connect();
    connection.query(
      fs.readFileSync("sql/getSearchClubs.sql", "utf-8"),
      (err, rows, fields) => {
        callback(rows);
      }
    );
    connection.end(); */
  "sql/getSearchClubs.sql".gf().query((err, rows, fields) => {
    if (err) callback(err);
    else callback(rows);
  });
}
function controlForUserDevice(engName, token) {
  token =
    "dybWCsvWR1KXBSlgTU1ocg:APA91bGM8fzGQy3c9shE4ZKywouYAD-ZYRZDJjgA60U4tOV7HeQyNJW01nTUi5bIf2B_dkVXtRBv75HpTrg70UnX0DurwwvWckOLyZzrmt5Kk5MIiluUfDX0O1M1fo2CegVNlqzirWp8";
  console.log(token);
  const message = {
    data: {
      command: "search",
      club: engName,
      club_id: golfClubIds[engName],
    },
    // topic: "search",
    token,
  };
  console.log(message);
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
function controlForAdminDevice(engName) {
  const message = {
    data: {
      command: "search",
      club: engName,
      club_id: golfClubIds[engName],
    },
    topic: "admin",
    // token,
  };
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
function getSearchScriptAdmin(engName, command) {
  if (!command) command = "NORMAL";
  const golfClubId = golfClubIds[engName];
  const param = {
    golf_club_id: "",
    golf_course: [],
    command,
  };
  // step 1: course 정보
  golfCourseByEngId[engName].forEach((course, i) => {
    if (i === 0) param.golf_club_id = course.golf_club_id;
    param.golf_course.push(
      [
        "'" + course.golf_course_name + "'",
        ": '",
        course.golf_course_id,
        "',",
      ].join("")
    );
  });
  param.golf_course = param.golf_course.join("\r\n\t");

  // step 2: 공통 변수 및 함수
  const path = "template/search/";
  const mneCallCommon = (path + "mneCallCommon.js").gf();
  const a = (path + "search_common.js").gf();
  const b = (path + "search_common2.js").gf();
  const c = (path + "search_function.js").gf();
  const cores = ("script/search_core/" + engName + ".js")
    .gf()
    .split("/* <============line_div==========> */");
  const core = cores.pop();
  const d = cores.join("").dp({ mneCallCommon });

  // LOGOUT
  const loPath = "script/search_logout/" + engName + ".json";
  let { LOGOUT } = loPath.gfjp();
  const searchCommonScript = a.add(b).add(c).add(d).add(LOGOUT).dp(param);

  // step 3: 동작 함수
  const addr = "script/search_wrapper/" + engName + ".js";
  const chk = fs.existsSync(addr);
  let wrapper;
  let script;
  if (chk) {
    wrapper = addr.gf();
    script = wrapper.dp({ searchScript: core });
  } else {
    script = core;
  }
  const searchScript = script.dp({ golfClubId });

  return { searchCommonScript, searchScript };
}
function getSearchScript(engName, command) {
  if (!command) command = "NORMAL";
  const golfClubId = golfClubIds[engName];
  const param = {
    golf_club_id: "",
    golf_course: [],
    command,
  };
  log("course", engName, golfCourseByEngId[engName]);
  golfCourseByEngId[engName].forEach((course, i) => {
    if (i === 0) param.golf_club_id = course.golf_club_id;
    param.golf_course.push(
      [
        "'" + course.golf_course_name + "'",
        ": '",
        course.golf_course_id,
        "',",
      ].join("")
    );
  });
  param.golf_course = param.golf_course.join("\r\n\t");
  const template = gf("search_template.js").dp(param);
  const common = gf("search_template2.js").add(gf("search_template3.js"));
  const core = gf("script/search_core/" + engName + ".js");
  let wrapper;
  try {
    wrapper = gf("script/search_wrapper/" + engName + ".js");
  } catch (e) {
    console.log(e.toString());
  }

  let script;
  if (wrapper) script = wrapper.dp({ searchScript: template + common + core });
  else script = template + common + core;

  return script.dp({ golfClubId });
}
function getLinkLoginScript(engName) {
  const golfClubId = engName;
  const path = "template/login/";
  const cover = gf(path + "cover.template");
  const template = gf(path + "login.template");
  const common = "script/common/common.js".gfdp(ENV);
  const chk = fs.existsSync("script/link/login/" + engName + ".js");
  if (!chk) return "";

  let loginScript = gf("script/link/login/" + engName + ".js");
  loginScript = loginScript.split("\r\n").join("\r\n    ");
  let loginContent = template.dp({ common, loginScript, golfClubId });
  loginContent = cover.dp({ loginContent });

  return loginContent;
}
function getPureLoginScript(engName) {
  const golfClubId = golfClubIds[engName];
  const cover = fs.readFileSync("template/login/cover.template", "utf-8");
  const template = fs.readFileSync("template/login/login.template", "utf-8");
  const common = "";
  let loginScript;
  let loginContent;
  try {
    loginScript = fs
      .readFileSync("script/login/" + engName + ".js", "utf-8")
      .split("\r\n")
      .join("\r\n    ");
    loginContent = template.dp({ common, loginScript, golfClubId });
  } catch (e) {
    loginContent = "no login script";
  }
  return loginContent;
}
function getLoginScriptAdmin(engName) {
  const golfClubId = golfClubIds[engName];
  const path = "template/login/";
  const cover = gf(path + "cover.template");
  const template = gf(path + "login.template");
  const common = "script/common/common.js".gfdp(ENV);
  const chk = fs.existsSync("script/login/" + engName + ".js");
  if (!chk) return "";

  let loginScript = gf("script/login/" + engName + ".js");
  loginScript = loginScript.split("\r\n").join("\r\n    ");
  let loginContent = template.dp({ common, loginScript, golfClubId });
  loginContent = cover.dp({ loginContent });

  return loginContent;
}
function getLoginScript(engName, noCover) {
  const golfClubId = golfClubIds[engName];
  const cover = "template/login/cover.template".gf();
  const template = "template/login/login.template".gf();
  const common = "script/common/common.js".gfdp(ENV);
  let loginScript;
  let loginContent;
  try {
    loginScript = ("script/login/" + engName + ".js")
      .gf()
      .split("\r\n")
      .join("\r\n    ");
    loginContent = template.dp({ common, loginScript, golfClubId });
    log("noCover", noCover);
    if (noCover == undefined) loginContent = cover.dp({ loginContent });
  } catch (e) {
    loginContent = "no login script";
  }
  return loginContent;
}
function gf(file) {
  //get file
  return fs.readFileSync(file, "utf-8");
}

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
