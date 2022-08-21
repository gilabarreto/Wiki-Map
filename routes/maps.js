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

router.get("/", (req, res) => {
  res.render('maps')
})

router.get("/create", (req, res) => {
  res.render('create-maps');
})

router.get("/favourites", (req, res) => {
  res.render('favourites')
})

/////////////////////
// POST Requests //
///////////////////

router.post("/edit", (req, res) => {
  res.render('edit');
})

module.exports = router;
