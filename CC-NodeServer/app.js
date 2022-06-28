const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const googleTrends = require("google-trends-api");

var jsonParser = bodyParser.json();

app.get("/", (req, res) => {
  res.send("API runnning...");
});

app.post("/api", jsonParser, (req, res) => {
  let term = req.body.term;
  let yearAgo = Date.now() - 31536000000;
  yearAgo = new Date(yearAgo);
  let zippedData = [];
  googleTrends
    .interestOverTime({
      keyword: term,
      startTime: yearAgo,
      geo: "US",
      granularTimeResolution: true,
    })
    .then(function (results) {
      var json = JSON.parse(results);
      let interestingData = json.default.timelineData;
      interestingData.forEach((element) => {
        if (element.hasData[0]) {
          zippedData.push({
            x: element.formattedAxisTime,
            y: element.value[0],
          });
        }
      });
      res.send(zippedData);
    })
    .catch(function (err) {
      console.error("Oh no there was an error", err);
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
