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

function getUserByEmail(db, email) {
  return db.query('SELECT * FROM users WHERE email = $1', [email])
    .then(data => {
      const user = data.rows[0];
      console.log("--------------------", user)
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
};
