// Settings for auth-api app

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql:///brewery_finder_db_test"
    : "postgres://jqlmihlj:THazLj2D2zWiN8SYbGKQQPtatlOkuNkt@bubble.db.elephantsql.com/jqlmihlj";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};
