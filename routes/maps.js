/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { getUserById, getMapPoints, getMap, getAllFavourites } = require("../helpers");

module.exports = (db) => {
  ///////////////////
  // GET Requests //
  /////////////////

  function hasUser(userId, cb, res) {
    getUserById(db, userId)
      .then(cb)
      .catch((err) => {
        res.status(500).send("Error: err.message");
      });
  }

  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId).then((user) => {
      if (user) {
        getMap(db, userId)
          .then((data) => {
            res.render("maps", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      }
    });

    /*     hasUser(userId,() => {
        res.render("index", { userId, userName });
      }); */
  });

  router.get("/create", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)
      .then((data) => {
        res.render("create-maps", { userId, userName });
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
      });
  });

  router.get("/:id/favourites", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId).then((user) => {
      if (user) {
        getAllFavourites(db)
          .then((data) => {
            res.render("favourites", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      }
    });
  });

  router.get("/:id/points", (req, res) => {
    getMapPoints(db, req.params.id).then((points) => {
      res.json(points);
    });
  });

  router.get("/:mapId/edit", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)
      .then((data) => {
        res.render("edit-maps", { userId, userName, id: req.params.mapId });
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
      });
  });

  router.get("/:id", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)
      .then((data) => {
        res.render("maps", { userId, userName, id: req.params.id });
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
      });
  });

  /////////////////////
  // POST Requests //
  ///////////////////

  router.post("/create", (req, res) => {
    const user_id = req.session.user_id;
    const title = req.body.title;
    const description = req.body.description;

    getUserById(db, user_id);

    /*       .then(user => {
        if (user) {
          return res.status(400).send("E-mail already on our database.");
        }
        if (userName === "" | userEmail === "" || userPassword === "") {
          return res.status(400).send("Name, E-mail and Password can not be blank. Please try again.");
        } */

    db.query(
      `INSERT INTO maps (
          user_id, title, description)
          VALUES ($1, $2, $3)
          RETURNING id`,
      [user_id, title, description]
    ).then((result) => {
      console.log(result.rows[0].id);
      res.redirect(`/maps/${result.rows[0].id}/edit`);
    });
  });

  router.post("/:mapId/points", (req, res) => {
    const map_id = req.params.mapId;
    const description = req.body.description;
    const title = req.body.title;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    console.log("Map id", map_id);
    db.query(
      `INSERT INTO points (
      map_id, description, title, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,
      [map_id, description, title, latitude, longitude]
    )
      .then((data) => {
        res.status(200).send();
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
        console.log(err);
      });
  });

  router.post("/:mapId/delete", (req, res) => {
    const map_id = req.params.mapId;
    const userId = req.session.user_id;
    const userName = req.session.name;
    getUserById(db, userId).then((user) => {
      if (user) {
        db.query(`DELETE FROM maps WHERE id = $1`, [map_id]);
        getMap(db, userId)
          .then((data) => {
            console.log("data2", data);
            res.render("maps", { userId, userName, map_id, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      }
    });
  });
  return router;
};
