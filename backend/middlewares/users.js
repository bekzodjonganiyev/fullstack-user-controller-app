const jwt = require("jsonwebtoken");

module.exports = {
  validateRegister: (req, res, next) => {
    //username min length 3
    if (!req.body.username) {
      return res.status(400).send({
        msg: "Please enter more then 3 character",
      });
    }

    // password valdation
    if (!req.body.password) {
      return res.status(400).send({
        msg: "Please enter password",
      });
    }

    // password repeat
    if (!req.body.password || req.body.password !== req.body.password_repeat) {
      return res.status(400).send({
        msg: "Both passwords must match",
      });
    }
    next();
  },

  isLoggedIn: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(400).send({
        msg: "Your session not valid",
      });
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token)
      const decoded = jwt.verify(token, "SECRETKEY");
      req.userData = decoded;
      next();
    } catch (error) {
      throw error;
      return res.status(400).send({
        msg: "Your session not valid",
      });
    }
  },
};
