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

  router.get("/", (req, res) => {
    const templateVars = { userId: null };
    res.render("login", templateVars);
  });

  router.post('/', (req, res) => {
    const { email, password } = req.body
    getUserByEmail(db, email)
      .then(user => {
        if (!user) {
          return res.status(404).send("User not found.")
        }
        if (user.password !== password) {
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
