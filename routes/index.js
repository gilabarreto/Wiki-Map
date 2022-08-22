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
    const userName = req.session.name;

    getUserById(db, userId)

      .then(data => {
        console.log(data)
        res.render('index', { userId, userName });
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: err.message");
      });
  });
  return router;
};
