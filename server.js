require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("./database");

const userRoutes = require("./routes/userRoutes");

const port = process.env.PORT ?? 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//User routes
app.use("/user", userRoutes);

//Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`VFC backend listening on port ${port}`);
});
