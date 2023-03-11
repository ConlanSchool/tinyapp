const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
<<<<<<< HEAD
const { generateRandomString, checkEmail } = require("./helpers");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const users = {};
const urlDatabase = {};

//Middleware to handle user
app.use((req, res, next) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  req.user = user;
  next();
});

//Registration handlers
app.get("/register", (req, res) => {
  const templateVars = { user: req.user };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Check if email and password fields are empty
  if (!email || !password) {
    res.status(403).send("Email and password fields are required");
    return;
  }

  // Check if email has been registered
  if (checkEmail(email, users)) {
    res.status(409).send("Email already exists");
    return;
  }

  //User creation
  const genID = generateRandomString();
  const newUser = {
    id: genID,
    email: email,
    password: password,
  };

  users[genID] = newUser;
  res.cookie("user_id", newUser.id);
  res.redirect("/urls");
=======
const { generateRandomString } = require("./helpers");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const users = {};
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//
//
//

app.post("/login", (req, res) => {
  const { username } = req.body; // Get the value of the "username" field from the request body
  res.cookie("username", username); // Set a cookie named "username" with the submitted value
  res.redirect("/urls");
});

//
//
//

app.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
>>>>>>> b3e9ba38b34b1ea2adb8d34550a8bd13b26f5d10
});

//Login handlers
app.get("/login", (req, res) => {
  const templateVars = { user: req.user };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = checkEmail(email, users);

  // Check if email and password fields are empty
  if (!email || !password) {
    res.status(403).send("Email and password fields are required");
    return;
  }

  if (!checkEmail(email, users)) {
    res.status(403).send("Email does not exist");
    return;
  }

  if (password !== user.password) {
    res.status(403).send("Incorrect password");
    return;
  }

  res.redirect("/urls");
});

<<<<<<< HEAD
//Clears cookies on logout
app.post("/logout", (req, res) => {
  req.cookies = null;
  res.clearCookie("user_id");
  res.redirect("/login");
});

//Redirects from default route
app.get("/", (req, res) => {
  if (req.users) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { user: req.user, urls: urlDatabase };
=======
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  console.log(templateVars);
>>>>>>> b3e9ba38b34b1ea2adb8d34550a8bd13b26f5d10
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
});

//
//
//

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const newURL = req.body.longURL;
  const newShort = generateRandomString();

  urlDatabase[newShort] = newURL;
  delete urlDatabase[req.params.id];

  res.redirect("/urls");
});

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { users };
=======
//module.exports = { users };
>>>>>>> b3e9ba38b34b1ea2adb8d34550a8bd13b26f5d10
