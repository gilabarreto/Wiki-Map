/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { getUserById, getAllMap, getMap, getAllMapsEx } = require("../helpers");

module.exports = (db) => {
  ///////////////////
  // GET Requests //
  /////////////////

  // GET Route for INDEX
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId).then((user) => {
      if (user) {
        console.log("user",user);
        getAllMapsEx(db, userId)
          .then((data) => {
            console.log("after function",data);
            res.render("index", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500);
            console.log(err);
          });
      } else {
        getAllMap(db)
          .then((data) => {
            res.render("index", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      }
    });
  });

  /////////////////////
  // POST Requests //
  ///////////////////

  // POST Route to ADD FAVOURITE to users' FAVOURITES'
  router.post("/:mapId", (req, res) => {
    const map_id = req.params.mapId;
    const userId = req.session.user_id;
    const userName = req.session.name;

    getMap(db, userId).then((map) => {
      if (map) {
        db.query(
          `INSERT INTO favourites (
          map_id, user_id)
          VALUES ($1, $2)
          RETURNING *;`,
          [map_id, userId]
        )
        getAllMapsEx(db, userId)
          .then((data) => {
              res.render("index", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
            console.log(err);
          });
      }
    });
  });
  return router;
};
