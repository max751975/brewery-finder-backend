const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.get("/", (req, res, next) => {
  res.send("AUTH IS CONNECTED!!!");
});

// create new user
router.post("/register", async (req, res, next) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      location,
      isAdmin,
    } = req.body;

    const user = await User.create(
      username,
      password,
      firstName,
      lastName,
      email,
      location,
      isAdmin
    );
    console.log(user);

    return res.status(201).json(user);
  } catch (error) {
    if (error.code === "23505") {
      return next(new ExpressError("Username taken. Try another one!", 400));
    } else return next(error);
  }
});

// login user and returns JWT on success
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username/password required", 400);
    }
    const result = await db.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);
    let user = result.rows[0];

    if (user) {
      if ((await bcrypt.compare(password, user.password)) === true) {
        let token = jwt.sign(user, SECRET_KEY);

        return res.json({ message: "Logged in successfully", token, user });
      }
    }
    throw new ExpressError("Invalid username/password", 400);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
