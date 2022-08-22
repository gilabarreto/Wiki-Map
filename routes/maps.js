/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getUserById } = require('../helpers');

module.exports = (db) => {

  ///////////////////
  // GET Requests //
  /////////////////

  router.get("/", (req, res) => {

    const userId = req.session.user_id;
    const name = req.session.name;

    getUserById(db, userId)

      .then(data => {
        console.log(data)
        res.render('index', { userId, name });
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  });

  router.get("/favourites", (req, res) => {

    const userId = req.session.user_id;
    const name = req.session.name;

    getUserById(db, userId)

      .then(data => {
        console.log(data)
        res.render('favourites', { userId, name });
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  });

  router.get("/create", (req, res) => {

    const userId = req.session.user_id;
    const name = req.session.name;

    getUserById(db, userId)

      .then(data => {
        console.log(data)
        res.render('create-maps', { userId, name });
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  });

  /////////////////////
  // POST Requests //
  ///////////////////

  router.post("/create", (req, res) => {
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

  router.post("/edit", (req, res) => {
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
