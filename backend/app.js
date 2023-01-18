const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { environment } = require("./config");
const isProduction = environment === "production";
const { ValidationError } = require("sequelize");
const { makeError } = require("./utils/auth");

const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

const routes = require("./routes");

app.disable('etag');

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  }),
);

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  }),
);

app.use(routes); // Connect all the routes

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  next(makeError("The requested resource couldn't be found.", 404))
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    return next(makeError('Validation error', 400, err.errors.map((e) => e.message)))
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  console.log(err)
  res.status(err.statusCode || 500);
  res.json(err);
});

module.exports = app;
