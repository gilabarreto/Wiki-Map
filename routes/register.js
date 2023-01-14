const express = require('express');
const router = express.Router();
const { getUserByEmail } = require('../helpers');


module.exports = (db) => {

  ///////////////////
  // GET Requests //
  /////////////////

  // GET Route for REGISTER
  router.get("/", (req, res) => {
    const templateVars = { userId: null };
    res.render("register", templateVars);
  });

  /////////////////////
  // POST Requests //
  ///////////////////

  // POST Route to REGISTER a new user
  router.post('/', (req, res) => {

    const userName = req.body.name
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    getUserByEmail(db, userEmail)

      .then(user => {
        if (user) {
          return res.status(400).send("E-mail already on our database.");
        }
        if (userName === "" | userEmail === "" || userPassword === "") {
          return res.status(400).send("Name, E-mail and Password can not be blank. Please try again.");
        }

        db.query(`INSERT INTO users (
          name, email, password)
          VALUES ($1, $2, $3)
          RETURNING *`, [userName, userEmail, userPassword]).then(user => {
            req.session.user_id = user.id;
            req.session.name = user.name;

            res.redirect('/');
          })
      })
  });

  return router;

};
