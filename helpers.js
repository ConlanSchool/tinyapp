const { users, urlDatabase } = require("./express_server");

function generateRandomString() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function checkEmail(email, users) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}

function urlsForUser(id) {
  const userURLs = {};
  for (const shortURL in urlDatabase) {
    const url = urlDatabase[shortURL];
    if (url.userID === id) {
      userURLs[shortURL] = url;
    }
  }
  return userURLs;
}

module.exports = { generateRandomString, checkEmail, urlsForUser };
