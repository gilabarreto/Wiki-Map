/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { getUserById, getAllMap, getMap } = require("../helpers");

module.exports = (db) => {
  ///////////////////
  // GET Requests //
  /////////////////

  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId).then((user) => {
      if (user) {
        getAllMap(db)
          .then((data) => {
            res.render("index", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
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
          .then((dbdata) => {
            getAllMap(db).then((data) => {
              res.render("index", { userId, userName, data });
            });
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
