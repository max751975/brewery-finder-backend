const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

function authenticateJWT(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;

    return next();
  } catch (error) {
    return next();
  }
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    const e = new ExpressError("Unauthorized", 401);
    return next(e);
  } else {
    return next();
  }
}

function ensureIsAdmin(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return next(new ExpressError("Must be admin to access", 401));
  }
  return next();
}

module.exports = { authenticateJWT, ensureLoggedIn, ensureIsAdmin };
