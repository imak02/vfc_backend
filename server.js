const express = require("express");
const app = express();
require("dotenv").config();
require("./database");

const port = process.env.PORT ?? 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`VFC backend listening on port ${port}`);
});
