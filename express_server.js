const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;
const { generateRandomString, checkEmail, urlsForUser } = require("./helpers");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

const users = {};
const urlDatabase = {};

//Middleware to handle user
app.use((req, res, next) => {
  const userId = req.session.user_id;
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
    password: bcrypt.hashSync(password, 11),
  };

  users[genID] = newUser;
  req.session.user_id = newUser.id;
  res.redirect("/urls");
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

  if (!bcrypt.compareSync(password, user.password)) {
    res.status(403).send("Incorrect password");
    return;
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});

//Clears cookies on logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//Redirects from default route
app.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  if (!req.user) {
    const templateVars = {
      user: req.user,
      error: "Please log in or register to see your URLs.",
    };
    res.status(401).render("login", templateVars);
    return;
  }
  const userUrls = urlsForUser(req.user.id, urlDatabase);
  const templateVars = { user: req.user, urls: userUrls };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    return;
  }

  const templateVars = { user: req.user };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.user) {
    res.status(401).send("You need to be logged in to shorten URLs.");
    return;
  }

  // Generate a short URL and save it to the database
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = req.user.id;
  urlDatabase[shortURL] = { longURL: longURL, userID: userID };

  // Redirect to the newly saved URL
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/:id", (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const url = urlDatabase[id];

  // Check if user is logged in
  if (!user) {
    res.status(401).send("You need to be logged in to view this page.");
    return;
  }

  // Check if URL exists
  if (!url) {
    res.status(404).send("URL not found.");
    return;
  }

  // Check if user owns URL
  if (user.id !== url.userID) {
    res.status(403).send("You don't have permission to view this URL.");
    return;
  }

  const templateVars = {
    id: id,
    longURL: url.longURL,
    user: user,
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const user = req.user;
  const shortURL = req.params.id;
  const newlongURL = req.body.longURL;

  // Check if user is logged in
  if (!user) {
    res.status(401).send("You must be logged in to edit URLs");
    return;
  }

  // Check if URL exists
  if (!urlDatabase[shortURL]) {
    res.status(404).send("URL not found");
    return;
  }

  // Check if user owns URL
  if (user.id !== urlDatabase[shortURL].userID) {
    res.status(403).render("error", {
      message: "You don't have permission to update this URL.",
    });
    return;
  }
  // Generate a new shortURL
  const newShortURL = generateRandomString();

  // Update the URL in the database
  urlDatabase[newShortURL] = {
    longURL: newlongURL,
    userID: user.id,
  };
  delete urlDatabase[shortURL];

  console.log(urlDatabase);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
