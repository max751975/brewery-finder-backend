const db = require("../db");
const User = require("../models/user");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM breweries");

  await db.query(
    "INSERT INTO breweries (name, location) VALUES ('B1', 'Loc1'),('B2', 'Loc2'),('B3', 'Loc3'),('B4', 'Loc4')"
  );
}

await User.create({
  username: "user1",
  password: "password1",
  firstName: "U1F",
  lastName: "U1L",
  email: "user1@mail.com",
  location: "Loc1",
  isAdmin: true,
});
await User.create({
  username: "user2",
  password: "password2",
  firstName: "U2F",
  lastName: "U2L",
  email: "user2@mail.com",
  location: "Loc2",
  isAdmin: false,
});
await User.create({
  username: "user3",
  password: "password3",
  firstName: "U3F",
  lastName: "U3L",
  email: "user3@mail.com",
  location: "Loc3",
  isAdmin: true,
});

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}
module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
