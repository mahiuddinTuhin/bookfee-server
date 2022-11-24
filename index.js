const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
// app.use(dotenv();
const port = process.env.PORT;
app.get("/", (req, res, next) => {
  res.send("server is running well");
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
