/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

///////////////////
// GET Requests //
/////////////////

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        res.render('maps');
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  });
  router.get("/create", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        res.render('create-maps');
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  });
  router.get("/favourites", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        res.render('favourites');
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  });
  router.get("/edit", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        res.render('edit');
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  });
  return router;
};

/////////////////////
// POST Requests //
///////////////////
