const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const User = require("../models/user");

const { ensureLoggedIn, ensureIsAdmin } = require("../middleware/auth");

// get all users with User class instances
router.get("/", ensureIsAdmin, async (req, res, next) => {
  try {
    const users = await User.getAll();
    return res.json(users);
  } catch (error) {
    next(error);
  }
});

// get user by id
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    let user = await User.getById(req.params.id);

    return res.json(user);
  } catch (error) {
    next(error);
  }
});

// create new user - only for admin

router.post("/", ensureIsAdmin, async (req, res, next) => {
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
    return next(error);
  }
});

// update user, returning user instance
router.patch("/:id", async (req, res, next) => {
  try {
    const user = await User.getById(req.params.id);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.location = req.body.location;
    user.save();
    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

// delete user by id
router.delete("/:id", ensureIsAdmin, async (req, res, next) => {
  try {
    let user = await User.getById(req.params.id);
    await user.remove();
    return res.json({ msg: "DELETED" });
  } catch (error) {
    return next(error);
  }
});

// get a list of breweries b for user with current id

router.get("/:id/breweries", ensureLoggedIn, async (req, res, next) => {
  try {
    const results = await db.query(
      `SELECT u.id, u.username, b.id as brewery_id, b.name as brewery_name, b.location
        FROM users AS u
        LEFT JOIN users_breweries AS ub
        ON u.id = ub.user_id
        LEFT JOIN breweries AS b
        ON ub.brewery_id = b.id
        WHERE u.id = $1`,
      [req.params.id]
    );

    const { id, username } = results.rows[0];
    console.log(results.rows);
    let breweries = [];
    if (results.rows[0].brewery_name) {
      breweries = results.rows.map((r) => ({
        ["brewery_id"]: r.brewery_id,
        ["brewery_name"]: r.brewery_name,
        ["location"]: r.location,
      }));
    }

    return res.send({ id, username, breweries });
  } catch (error) {
    return next(new ExpressError("You have to be logged in", 401));
  }
});

// create new brewery for user
router.post("/:id/breweries", ensureLoggedIn, async (req, res, next) => {
  try {
    const { name, location } = req.body;
    const newBrewery = await db.query(
      `INSERT INTO breweries (name, location) VALUES ($1,$2) RETURNING *`,
      [name, location]
    );

    const newUsersBrewery = await db.query(
      `INSERT INTO users_breweries (user_id, brewery_id) VALUES ($1,$2)`,
      [req.params.id, newBrewery.rows[0].id]
    );

    return res.status(201).json(newBrewery.rows);
  } catch (error) {
    return next(new ExpressError("You are not authorised", 401));
  }
});

module.exports = router;
