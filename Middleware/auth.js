const jwt = require("jsonwebtoken");
require("dotenv").config();


// // middleware for authentificating the user through the token
const auth = (req, res, next) => {
  const token = req.header("x-access-token");
  try {
    if (!token) {
      return res.status(406).json({ err: "authorization denied" });
    } else {
      const verified = jwt.verify(token, process.env.TOKEN);
      if (!verified) {
        return res.json({ err: "token verification failed" });
      } else {
        next();
      }
    }
  } catch (error) {
    res.json({ error: "there was an error" });
  }
};

module.exports = {
  auth,
};
