const express = require("express");
const router = express.Router();
const { getUserById, getAllMap, getAllMapsEx, getAllFavourites } = require("../helpers");

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


  return router;
};
