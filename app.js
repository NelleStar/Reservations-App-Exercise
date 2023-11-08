// require modules: express, nunjucks(to render the Jinja templates), body parser(a dodule used to process data sent in an HTTP request)
const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");

// create an instance of the Express application
const app = express();

// require files: routes and expressError
const routes = require("./routes");
const ExpressError = require("./expressError");

// Configure Nunjucks for template rendering
nunjucks.configure("templates", {
  autoescape: true,
  express: app
});

// Parse body for urlencoded (non-JSON) data
app.use(bodyParser.urlencoded({ extended: false }));

// mount all route handlers defined within my routes.js file
app.use(routes);

/** 404 handler */
app.use(function (req, res, next) {
  const err = new ExpressError('Not Found', 404);
  return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message
  });
});

// allow app to be exported and used in other files
module.exports = app;
