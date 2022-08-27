/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const { database } = require("pg/lib/defaults");
const router = express.Router();
const {
  getUserById,
  getMapPoints,
  getMap,
  getAllFavourites,
  getMapByMapId,
  getAllMapsEx
} = require("../helpers");

module.exports = (db) => {
  ///////////////////
  // GET Requests //
  /////////////////

  // GET Route for MAPS
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)
      .then((user) => {
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
  });

  // GET Route for CREATE
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

  // GET Route for FAVOURITES
  router.get("/favourites", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)
      .then((user) => {
        if (user) {
          getAllFavourites(db, userId)
            .then((data) => {
              console.log("fav data", data)
              res.render("favourites", { userId, userName, data });
            })
            .catch((err) => {
              res.status(500).send("Error: err.message");
            });
        }
      });
  });

  //GET Route for MY MAP
  router.get("/:mapId/map", (req, res) => {

    const userId = req.session.user_id;
    const userName = req.session.name;
    const mapId = req.params.mapId

    /*     getUserById(db, userId).then((user) => {
          if (user) { */
    getMapByMapId(db, mapId)
      .then((data) => {
        res.render("my-maps", { userId, userName, id: mapId, data });
      })
      .catch((err) => {
        console.log(err);
        /*           });
              } */
      });
  });

  // GET Route for POINTS
  router.get("/:id/points", (req, res) => {
    getMapPoints(db, req.params.id, res).then((points) => {
      res.json(points);
    });
  });

  // GET Route for EDIT
  router.get("/:mapId/edit", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;
    const mapId = req.params.mapId

    getUserById(db, userId)
      .then(() => {
        getMapByMapId(db, mapId)
          .then((mapData) => {
            res.render("edit-maps", { userId, userName, id: mapId, mapData });
          })
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
      });
  });

  // GET Route for /maps/user_id
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

  // POST Route to CREATE a MAP
  router.post("/create", (req, res) => {
    const userId = req.session.user_id;
    const title = req.body.title;
    const description = req.body.description;

    db.query(
      `INSERT INTO maps (
          user_id, title, description)
          VALUES ($1, $2, $3)
          RETURNING id`,
      [userId, title, description]
    ).then((result) => {
      console.log(result.rows[0].id);
      res.redirect(`/maps/${result.rows[0].id}/edit`);
    });
  });

  // POST Route to ADD FAVOURITE to users' FAVOURITES'
  router.post("/:mapId", (req, res) => {
    const map_id = req.params.mapId;
    const userId = req.session.user_id;
    const userName = req.session.name;

    getMap(db, userId)
      .then((map) => {
        if (map) {
          db.query(
            `INSERT INTO favourites (
        map_id, user_id)
        VALUES ($1, $2)
        RETURNING *;`,
            [map_id, userId]
          ).then(() => {
            getAllMapsEx(db, userId)
              .then((allMaps) => {
                getAllFavourites(db, userId)
                  .then((favData) => {
                    const favDataIds = favData.map(obj => obj.map_id)
                    const data = allMaps.filter(obj => {
                      return !favDataIds.includes(obj.id)
                    })
                    res.render("index", { userId, userName, data });
                  })
              })
              .catch((err) => {
                res.status(500);
                console.log(err);
              })
          });
        }
      });
  });

  // POST Route to ADD POINTS to a MAP
  router.post("/:mapId/points", (req, res) => {

    const map_id = req.params.mapId;
    const description = req.body.description;
    const title = req.body.title;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

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

  // POST Route to DELETE POINTS to a MAP
  router.post("/:mapId/points/delete", (req, res) => {

    const map_id = req.params.mapId;
    const description = req.body.description;
    const title = req.body.title;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    db.query(
      `INSERT INTO points (
      map_id, description, title, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,
      [map_id, description, title, latitude, longitude]
    )
      .then(() => {
        res.status(200).send();
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
        console.log(err);
      });
  });

  // POST Route to DELETE a FAVOURITE
  router.post("/favourites/:favId/delete", (req, res) => {

    const fav_id = req.params.favId;
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)
      .then((user) => {
        if (user) {
          db.query(`DELETE FROM favourites WHERE id = $1`, [fav_id])
            .then(() => {
              getAllFavourites(db, userId)
                .then((data) => {
                  res.render("favourites", { userId, userName, data });
                })
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  });

  // POST Route to DELETE a MAP
  router.post("/:mapId/delete", (req, res) => {

    const map_id = req.params.mapId;
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId).then((user) => {
      if (user) {
        db.query(`DELETE FROM maps WHERE id = $1`, [map_id]);
        getMap(db, userId)
          .then((data) => {
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
