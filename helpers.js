<<<<<<< HEAD
const { users } = require("./express_server");
=======
//const { users } = require("./express_server");
>>>>>>> b3e9ba38b34b1ea2adb8d34550a8bd13b26f5d10

function generateRandomString() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

<<<<<<< HEAD
function checkEmail(email, users) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}

module.exports = { generateRandomString, checkEmail };
=======
module.exports = { generateRandomString };
>>>>>>> b3e9ba38b34b1ea2adb8d34550a8bd13b26f5d10
