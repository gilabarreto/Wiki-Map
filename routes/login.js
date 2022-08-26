/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getUserByEmail } = require('../helpers');

module.exports = (db) => {

  ///////////////////
  // GET Requests //
  /////////////////

  // GET Route for LOGIN
  router.get("/", (req, res) => {
    const templateVars = { userId: null };
    res.render("login", templateVars);
  });

  /////////////////////
  // POST Requests //
  ///////////////////

  // POST Route to LOGIN an existing user
  router.post('/', (req, res) => {

    const userEmail = req.body.email;
    const userPassword = req.body.password;

    getUserByEmail(db, userEmail)

      .then(user => {
        if (!user) {
          return res.status(404).send("User not found.")
        }
        if (user.password !== userPassword) {
          return res.status(404).send("Invalid password.")
        }

        req.session.user_id = user.id;
        req.session.name = user.name;

        res.redirect('/');
      })
  });

  /*   router.get('/:id', (req, res) => {
      req.session.user_id = req.params.id;
      res.redirect('/');
    }); */

  return router;

};
