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
} else if (reqUrl == "/account" ) {
    objResp = {
      accounts: golfClubAccounts,
    };
} else if (reqUrl == "/clubGroup" ) {
    const club = data.club_id;
    const groupName = groupClubs[club];
    let result = [];
    if (groupName) result = golfClubGroups[groupName];
    objResp = {
      resultCode: 1,
      message: "OK",
      data: result,
    };
} else if (reqUrl == "/clubs" ) {
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
} else if (reqUrl == "/control" ) {
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
} else if (reqUrl == "/dbCheckGolfClubEngName" ) {
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
} else if (reqUrl == "/dbCheckGolfClubName" ) {
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
} else if (reqUrl == "/dbCheckServerfile" ) {
    const eng = data.eng_id;
    objResp = {
      type: "okay",
      data: { check: false },
    };
    if (fs.existsSync("script/search_dict/" + eng + ".json"))
      objResp.data.check = true;
} else if (reqUrl == "/dbGetGolfClub" ) {
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
} else if (reqUrl == "/dbGetGroup" ) {
    objResp = {
      type: "okay",
      data: groupClubs,
    };
} else if (reqUrl == "/dbNewGolfClub" ) {
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
} else if (reqUrl == "/dbNewGolfClubDetail" ) {
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
} else if (reqUrl == "/dbNewGolfClubEng" ) {
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
} else if (reqUrl == "/dbNewGolfClubOrder" ) {
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
} else if (reqUrl == "/dbNewGolfClubUsability" ) {
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
} else if (reqUrl == "/dbNewGolfCourse" ) {
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
} else if (reqUrl == "/dbNewGroup" ) {
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
} else if (reqUrl == "/dbNewServerfile" ) {
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
} else if (reqUrl == "/dbSetGolfClub" ) {
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
} else if (reqUrl == "/delDeviceRecord" ) {
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
} else if (reqUrl == "/delDeviceRecordTime" ) {
    delDeviceTime(data, (res2) => {
      objResp = {
        resultCode: 200,
        message: "디바이스 타임 자료를 모두 삭제했습니다.",
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/delGolfClubEvent" ) {
const { eventId } = data;
"sql/delGolfClubEvent.sql".gfdp(data).query((err, rows, fields) => {
  objResp = stdSQLProc(err, rows);
  response.write(JSON.stringify(objResp));
  response.end();
});

} else if (reqUrl == "/delGolfFashion" ) {
"sql/delGolfFashion.sql".gfdp(data).query((err, rows, fields) => {
  objResp = stdSQLProc(err, rows);
  response.write(JSON.stringify(objResp));
  response.end();
});

} else if (reqUrl == "/fileUploadTest" ) {
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

    objResp = {
      detectedCells,
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

} else if (reqUrl == "/getClubNames" ) {
    objResp = {
      golfClubEngToKor,
    };
} else if (reqUrl == "/getDeviceRound" ) {
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

} else if (reqUrl == "/getFeeLink" ) {
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
} else if (reqUrl == "/getGolfClubEvent" ) {
    "sql/getGolfClubEvent.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/getGolfFashion" ) {
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

} else if (reqUrl == "/getGolfGame" ) {
"sql/getGolfGame.sql".gfdp(data).query((err, rows, fields) => {
  objResp = stdSQLProc(err, rows);
  response.write(JSON.stringify(objResp));
  response.end();
});

} else if (reqUrl == "/getGolfGameScore" ) {
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

} else if (reqUrl == "/getGolfLessonMenu" ) {
    const menu = "template/golf/lesson.json".gfdp({});
    objResp = {
      result: "okay",
      data: menu,
    };
} else if (reqUrl == "/getGolfLink" ) {
    if (data.section == undefined) data.section = "";
    "sql/getGolfLink.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/getGolfLinkScript" ) {
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
} else if (reqUrl == "/getGolfNews" ) {
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
} else if (reqUrl == "/getGolfYoutubeHotClip" ) {
    const list = "template/golf/hotclip.json".gfdp({});
    objResp = {
      result: "okay",
      data: list,
    };
} else if (reqUrl == "/getLeaderBoardInfo" ) {
    const list = "template/golf/rank.json".gfjp();
    objResp = {
      result: "okay",
      data: list,
    };
} else if (reqUrl == "/getLog" ) {
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
    if (ob.device_id == data.device_id && ob.golf_club_id == data.golf_club_id)
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

} else if (reqUrl == "/getLogClubList" ) {
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

} else if (reqUrl == "/getLogDeviceList" ) {
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

} else if (reqUrl == "/getLogList" ) {
    const path = "/var/www/html/teelog";
    const files = fs.readdirSync(path);
    objResp = {
      result: "okay",
      data: files,
    };
} else if (reqUrl == "/getLogReport" ) {
    "sql/getLogReport.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/getMacroId" ) {
    "sql/getMacroId.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/getOpenGraphInfo" ) {
    ogs({ url: data.url }).then((data) => {
      if (data.error) objResp = { result: "error", data: data.error };
      else objResp = { result: "okay", data: data.result };
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/getOuterInfo" ) {
    const { club_id: clubId } = data;
    "sql/getOuterInfo.sql".gfdp({ clubId }).query((err, rows, fields) => {
      if (err) console.log(err);
      objResp = {
        data: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/getPenaltyLink" ) {
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
} else if (reqUrl == "/getScheduleDetail" ) {
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
} else if (reqUrl == "/getSettings" ) {
    const obj = "script/common/settings.json".gfjp();
    objResp = {
      type: "okay",
      settings: obj,
    };
} else if (reqUrl == "/getWarning" ) {
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
} else if (reqUrl == "/get_pure_login" ) {
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
} else if (reqUrl == "/get_pure_search_core" ) {
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
} else if (reqUrl == "/login" ) {
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
} else if (reqUrl == "/loginScripts" ) {
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
} else if (reqUrl == "/login_admin" ) {
    const { club } = data;
    objResp = {
      url: golfClubLoginUrl[club],
      script: getLoginScriptAdmin(club),
    };
} else if (reqUrl == "/login_link" ) {
    const { link_eng_id } = data;
    objResp = {
      url: golfLinks[link_eng_id].login_url,
      script: getLinkLoginScript(link_eng_id),
    };
} else if (reqUrl == "/modGolfClubEvent" ) {
    "sql/modGolfClubEvent.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/modGolfFashion" ) {
"sql/modGolfFashion.sql".gfdp(data).query((err, rows, fields) => {
  objResp = stdSQLProc(err, rows);
  response.write(JSON.stringify(objResp));
  response.end();
});

} else if (reqUrl == "/newGolfClubEvent" ) {
    "sql/newGolfClubEvent.sql".gfdp(data).query((err, rows, fields) => {
      objResp = stdSQLProc(err, rows);
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/newGolfFashion" ) {
"sql/newGolfFashion.sql".gfdp(data).query((err, rows, fields) => {
  objResp = stdSQLProc(err, rows);
  response.write(JSON.stringify(objResp));
  response.end();
});

} else if (reqUrl == "/newGolfGame" ) {
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

} else if (reqUrl == "/newGolfGameScore" ) {
"sql/newGolfGameScore.sql".gfdp(data).query((err, rows, fields) => {
  objResp = stdSQLProc(err, rows);
  response.write(JSON.stringify(objResp));
  response.end();
});

} else if (reqUrl == "/newGolfNews" ) {
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
} else if (reqUrl == "/question" ) {
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
} else if (reqUrl == "/reservebot" ) {
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
} else if (reqUrl == "/reservebot_admin" ) {
    objResp = reservebotAdmin(data);
} else if (reqUrl == "/reserveCancelbot" ) {
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
} else if (reqUrl == "/reserveCancelbot_admin" ) {
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
} else if (reqUrl == "/reserveSearchbot" ) {
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
} else if (reqUrl == "/reserveSearchbots_admin" ) {
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
} else if (reqUrl == "/reserveSearchbot_admin" ) {
    objResp = reserveSearchbotAdmin(data);
} else if (reqUrl == "/search" ) {
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
} else if (reqUrl == "/searchbot" ) {
    objResp = searchbot(data);
} else if (reqUrl == "/searchbots_admin" ) {
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
} else if (reqUrl == "/searchbots_date" ) {
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
} else if (reqUrl == "/searchbots_date_admin" ) {
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
} else if (reqUrl == "/searchbots_time" ) {
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
} else if (reqUrl == "/searchbots_time_admin" ) {
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
} else if (reqUrl == "/searchbot_admin" ) {
    objResp = searchbot(data);
} else if (reqUrl == "/search_core" ) {
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
} else if (reqUrl == "/setGolfClubState" ) {
    setGolfClubState(data, (rows) => {
      objResp = {
        resultCode: 200,
        message: rows,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
} else if (reqUrl == "/setGolfGameScore" ) {
"sql/setGolfGameScore.sql".gfdp(data).query((err, rows, fields) => {
  objResp = stdSQLProc(err, rows);
  response.write(JSON.stringify(objResp));
  response.end();
});

} else if (reqUrl == "/setReserveCancel" ) {
    objResp = setReserveCancel(data);
} else if (reqUrl == "/setReserveReserve" ) {
    objResp = setReserveReserve(data);
} else if (reqUrl == "/setReserveSearch" ) {
    objResp = setReserveSearch(data);
} else if (reqUrl == "/setSurvey" ) {
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
} else if (reqUrl == "/set_pure_login" ) {
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
} else if (reqUrl == "/set_pure_search_core" ) {
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