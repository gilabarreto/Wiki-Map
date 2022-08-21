const getUserByEmail = (email, db) => {
  for (const userId in db) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return undefined;
};

module.exports = {
  getUserByEmail
};
