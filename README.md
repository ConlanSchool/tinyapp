Tinyapp is a web application implemented using Express, with Node.js. The websote is a URL shortener that allows users to create short links for longer URLs. The application has a registration and login system, and users can only view and edit URLs they have created.

The application listens on port 8080 and uses the EJS templating engine. It also uses several middleware functions to handle various tasks, including parsing the request body, setting up cookie sessions, and checking if the user is logged in.

Requires:

Node.js
express
cookie-session
bcryptjs
ejs
