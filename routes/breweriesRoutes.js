const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const { ensureIsAdmin } = require("../middleware/auth");

// Get the list of all breweries, admin only route
router.get("/", ensureIsAdmin, async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM breweries ORDER BY id`);
    return res.json(results.rows);
  } catch (error) {
    return next(error);
  }
});

//  Get single brewery by id
router.get("/:id", async (req, res, next) => {
  try {
    let id = +req.params.id;
    let result = await db.query(`SELECT * FROM breweries WHERE id=$1`, [id]);
    if (result.rows.length === 0) {
      throw new ExpressError(`No brewery with id = ${id}`, 404);
    }
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// create new brewery
router.post("/", async (req, res, next) => {
  try {
    const { name, location } = req.body;
    const results = await db.query(
      `INSERT INTO breweries (name, location) VALUES ($1,$2) RETURNING *`,
      [name, location]
    );

    return res.status(201).json(results.rows);
  } catch (error) {
    return next(error);
  }
});

// update brewery, returning brewery
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const result = await db.query(
      `UPDATE breweries SET name=$1, location = $2 WHERE id=$3 RETURNING *`,
      [name, location, id]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

// delete brewery by id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = db.query(`DELETE FROM breweries WHERE id=$1`, [id]);
    return res.json({ msg: "DELETED" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
