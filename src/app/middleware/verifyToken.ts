const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .send({ error: true, message: "You are not authenticated !" });
    }

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_TOKEN_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: true, message: "Invalid Token !" });
  }
};
