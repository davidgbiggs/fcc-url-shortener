require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

const urlArray = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:urlIndex", (req, res) => {
  res.redirect(urlArray[req.params.urlIndex]);
});

app.post("/api/shorturl/new", function (req, res) {
  const httpRegex = /\/\//;
  dns.lookup(req.body.url.split(httpRegex)[1], (err, address, family) => {
    if (address === null) {
      res.send({ error: "invalid url" });
    } else {
      urlArray.push(req.body.url);
      const shortUrl = urlArray.length - 1;
      res.send({ original_url: req.body.url, short_url: shortUrl });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
