const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const ExpressError = require("../expressError");

class User {
  constructor(
    id,
    username,
    password,
    firstName,
    lastName,
    email,
    location,
    isAdmin
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.location = location;
    this.isAdmin = isAdmin;
  }

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
                      password,
                      first_name AS "firstName",
                      last_name AS "lastName",
                      email,
                      is_admin AS "isAdmin"
               FROM users
               WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new ExpressError("Invalid username/password", 403);
  }

  static async getAll() {
    const results = await db.query(
      `SELECT id, 
                username, 
                password, 
                first_name AS "firstName", 
                last_name AS "lastName", 
                email, location, 
                is_admin AS "isAdmin"  FROM users 
                ORDER BY id`
    );

    const users = results.rows.map(
      (r) =>
        new User(
          r.id,
          r.username,
          r.password,
          r.firstName,
          r.lastName,
          r.email,
          r.location,
          r.isAdmin
        )
    );

    return users;
  }

  //  Get instance of User by id
  static async getById(id) {
    const result = await db.query(
      `SELECT id, username,
                password,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                location,
                is_admin AS "isAdmin"
               FROM users
               WHERE id = $1`,
      [id]
    );

    let u = result.rows[0];
    if (!u) {
      throw new ExpressError("Invalid id", 404);
    }

    return new User(
      u.id,
      u.username,
      u.password,
      u.firstName,
      u.lastName,
      u.email,
      u.location,
      u.isAdmin
    );
  }

  // Create new user, return instance of this new User
  static async create(
    newUsername,
    newPassword,
    newFirstName,
    newLastName,
    newEmail,
    newLocation,
    newIsAdmin
  ) {
    // check if username already taken
    let user = await db.query(
      `SELECT username FROM users WHERE username='${newUsername}'`
    );
    if (user.rows[0]) {
      throw new ExpressError(
        "Username already exists. Choose another one, please",
        403
      );
    }
    if (!newIsAdmin) newIsAdmin = false;
    //  add new user to database, return instance of User
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (username,password, first_name, last_name, email, location, is_admin)
      VALUES ($1,$2,$3,$4,$5,$6,$7) 
      RETURNING id, username, password, first_name AS "firstName",
                                       last_name AS "lastName",
                                       email, location,
                                       is_admin AS "isAdmin"`,
      [
        newUsername,
        hashedPassword,
        newFirstName,
        newLastName,
        newEmail,
        newLocation,
        newIsAdmin,
      ]
    );
    const {
      id,
      username,
      password,
      firstName,
      lastName,
      email,
      location,
      isAdmin,
    } = result.rows[0];
    return new User(
      id,
      username,
      password,
      firstName,
      lastName,
      email,
      location,
      isAdmin
    );
  }

  // Deletes user from database
  async remove() {
    await db.query(`DELETE FROM users WHERE id=$1`, [this.id]);
  }

  // save changes in user object
  async save() {
    await db.query(
      `UPDATE users SET first_name = $1, last_name = $2, email = $3, location = $4
      WHERE id = $5`,
      [this.firstName, this.lastName, this.email, this.location, this.id]
    );
  }
}

module.exports = User;
