const express = require("express");
const mysql = require("mysql");
const cors = require("cors")

const router = require("./routes/router")

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use("/api", router)
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "bek022002/B",
//   database: "test",
// });

// app.get("/books", (req, res) => {
//   const q = "SELECT * FROM books";

//   db.query(q, (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });

// app.post("/books", (req, res) => {
//   const q = "INSERT INTO books (`title`, `desc`, `cover`) VALUES (?)";
//   const values = [
//     req.body.title,
//     req.body.desc,
//     req.body.cover,
// ];

//   db.query(q, [values], (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
