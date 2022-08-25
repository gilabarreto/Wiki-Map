function getUserById(db, id) {
  return db.query('SELECT * FROM users WHERE id = $1', [id])
    .then(data => {
      const user = data.rows[0];
      return user
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
}

function getMapPoints(db, id, res) {
  return db.query('SELECT * FROM points WHERE map_id = $1', [id])
    .then(data => {
      const points = data.rows;
      return points
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
}

function getMap(db, id, res) {
  return db.query('SELECT * FROM maps WHERE user_id = $1', [id])
    .then(data => {
      const maps = data.rows;
      return maps
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
}

function getUserByEmail(db, email) {
  return db.query('SELECT * FROM users WHERE email = $1', [email])
    .then(data => {
      const user = data.rows[0];
      return user
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
}

module.exports = {
  getUserById,
  getUserByEmail,
  getMapPoints,
  getMap
};
