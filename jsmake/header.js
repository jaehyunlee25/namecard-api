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
