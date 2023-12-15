const { Client } = require("pg");
const {DB_URI} = require("./config")

// let DB_URI;

// if (process.env.NODE_ENV === "test") {
//   DB_URI = "postgresql:///brewery_finder_db_test";
// } else {
//   DB_URI = "postgresql:///brewery_finder_db";
// }

let db = new Client({
  connectionString: DB_URI,
});

db.connect();

module.exports = db;
