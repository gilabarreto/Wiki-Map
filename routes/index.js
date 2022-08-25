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
      console.log("user", user);
      if (user) {
        getAllMap(db)
          .then((data) => {
            console.log("data index", data);
            res.render("index", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      } else {
        getAllMap(db)
          .then((data) => {
            console.log("data index", data);
            res.render("index", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      }
    });
  });

  router.post("/", (req, res) => {

    const map_id = req.params.mapId;
    const user_id = req.session.user_id;

    console.log("map id", map_id);
    console.log("user id", user_id);
    console.log("getMap", getMap(db, user_id));

    getMap(db, user_id).then((map) => {
      if (map) {
        db.query(
          `INSERT INTO favourites (
      map_id, user_id)
      VALUES ($1, $2)
      RETURNING *;`,
          [map_id, user_id]
        )
          .then((data) => {
            console.log(data);
            res.status(200).send();
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
