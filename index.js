const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8000;

const ShortURL = require("./models/urlShort");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const allData = await ShortURL.find();
  res.render("index", { shortUrls: allData });
});

app.post("/short", async (req, res) => {
  const fullUrl = req.body.fullUrl;
  console.log("URL requested: ", fullUrl);

  const record = new ShortURL({
    full: fullUrl,
  });

  await record.save();

  res.redirect("/");
});

app.get("/:shortid", async (req, res) => {
  const shortid = req.params.shortid;

  const rec = await ShortURL.findOne({ short: shortid });

  if (!rec) return res.sendStatus(404);

  rec.clicks++;
  await rec.save();

  res.redirect(rec.full);
});

mongoose.connect("mongodb://0.0.0.0/urlShortner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("open", async () => {
  app.listen(port, (err) => {
    if (err) {
      console.log("error on express server");
    }
    console.log("Server successfully running on port : ", port);
  });
});
