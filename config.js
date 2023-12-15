// Settings for auth-api app

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql:///brewery_finder_db_test"
    : "postgresql:///brewery_finder_db";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};
