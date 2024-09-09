import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use PORT from environment or fallback to 3000

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/twitter", (req, res) => {
  res.send("ruka");
});

app.get("/login", (req, res) => {
  res.send("<h1>please login to ruka<h1/>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
