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

  function hasUser(userId, cb, res) {

    getUserById(db, userId)

      .then(cb)
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  }

  router.get("/", (req, res) => {

    const userId = req.session.user_id;
    const userName = req.session.name;

    /* getUserById(db, userId)

      .then(data => {
        console.log(data)
        res.render('index', { userId, userName });
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      }); */

    hasUser(userId, () => {
        res.render('index', { userId, userName });
      }, res)
  });


  router.get("/favourites", (req, res) => {

    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)

      .then(data => {
        console.log(data)
        console.log("favorites", userName)
        res.render('favourites', { userId, userName });
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  });

  router.get("/create", (req, res) => {

    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)

      .then(data => {
        console.log(data)
        res.render('create-maps', { userId, userName });
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
