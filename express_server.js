const express = require("express");
const app = express();
const PORT = 8080;
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
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
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

//module.exports = { users };
