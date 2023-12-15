const express = require("express");
const ExpressError = require("./expressError");
const usersRoutes = require("./routes/usersRoutes");
const breweriesRoutes = require("./routes/breweriesRoutes");
const authRoutes = require("./routes/authRoutes");
const { authenticateJWT } = require("./middleware/auth");

const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// home test
app.get("/", (req, res) => {
  res.send("WELCOME TO BREWERY FINDER!!!");
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authenticateJWT);

app.use("/breweries", breweriesRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

// 404 catch --- passes to next handler
app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

// general error handler

app.use((error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
