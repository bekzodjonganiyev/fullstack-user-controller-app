const { Router, query } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const db = require("../lib/db");
const { validateRegister, isLoggedIn } = require("../middlewares/users");

//http://localhost:3000/api/sign-up
router.post("/sign-up", validateRegister, (req, res, next) => {
  db.query(
    `SELECT id FROM users WHERE LOWER(email) = LOWER('${req.body.email}')`,
    (err, data) => {
      if (data && data.length !== 0) {
        // error
        return res.status(409).send({
          msg: "This email is already taken!",
          data,
        });
      } else {
        // username not in use
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            const q = `INSERT INTO users (name, email, username, password, registered_time) VALUES ( ${db.escape(
              req.body.name
            )}, ${db.escape(req.body.email)}, ${db.escape(
              req.body.username
            )}, '${hash}', now());`;
            db.query(q, (err, data) => {
              if (err) {
                return res.status(400).send({
                  msg: err,
                });
              } else {
                return res.status(201).send({
                  msg: "Successfully Registered!",
                });
              }
            });
          }
        });
      }
    }
  );
});

//http://localhost:3000/api/login
router.post("/login", (req, res) => {
  db.query(
    `SELECT * FROM users WHERE username = ${db.escape(req.body.username)}`,
    (err, dataa) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      } else if (!dataa.length) {
        res.status(403).send({msg: "Username or password is wrong"})
      } else {
        db.query(
          `SELECT status FROM users WHERE username = ${db.escape(
            req.body.username
          )}`,
          (err, data) => {
            if (err) {
              throw err;
            } else {
              if (data[0].status === 0) {
                res
                  .status(403)
                  .send({ msg: "Unfortunately your status is blocked" });
              } else {
                console.log(data[0].status);
                bcrypt.compare(
                  req.body.password,
                  dataa[0]["password"],
                  (bErr, bData) => {
                    if (bErr) {
                      return res.status(400).send({
                        msg: "Username or password incorrect",
                      });
                    }
                    if (bData) {
                      const token = jwt.sign(
                        {
                          username: dataa[0].username,
                          userId: dataa[0].id,
                        },
                        "SECRETKEY",
                        { expiresIn: "1d" }
                      );
                      db.query(
                        `UPDATE users SET last_login_time = now() WHERE id = '${dataa[0].id}'`
                      );
                      return res.status(200).send({
                        msg: "Logged in",
                        token,
                        user: dataa[0],
                      });
                    } else {
                      return res.status(400).send({
                        msg: "Username or password incorrect",
                      });
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
  );
});

//http://localhost:3000/api/admin-panel
router.get("/admin-panel", isLoggedIn, (req, res, next) => {
  const q = `SELECT * FROM users`;
  db.query(q, (err, data) => {
    if (err) {
      return res.status(403).send({
        err,
      });
    } else {
      return res.status(200).send({ data });
    }
  });
});

// delete selected items endpoint
router.post("/delete-selected", (req, res, next) => {
  const userIds = req.body.arr;
  let q = "DELETE FROM users WHERE id = " + userIds[0];
  userIds.forEach((element) => {
    q += " OR id = " + element + "";
  });
  db.query(q, (err, data) => {
    if (err) {
      throw err;
      return res.json("Wrong MySql query!");
    } else {
      return res.status(200).send({ msg: "Successfully deleted", data });
    }
  });
});

// block/active selected items endpoint
router.put("/block-selected", (req, res) => {
  const userIds = req.body.arr;
  let q = "UPDATE users SET status = 0 WHERE id = " + userIds[0];
  userIds.forEach((element) => {
    q += " OR id = " + element + "";
  });
  db.query(q, (err, data) => {
    if (err) {
      throw err;
      return res.json("Wrong MySql query!");
    } else {
      return res.status(200).send({ msg: "Successfully blocked", data });
    }
  });
});

router.put("/active-selected", (req, res) => {
  const userIds = req.body.arr;
  let q = "UPDATE users SET status = 1 WHERE id = " + userIds[0];
  userIds.forEach((element) => {
    q += " OR id = " + element + "";
  });
  db.query(q, (err, data) => {
    if (err) {
      throw err;
      return res.json("Wrong MySql query!");
    } else {
      return res.status(200).send({ msg: "Successfully blocked", data });
    }
  });
});

module.exports = router;
