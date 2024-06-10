const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser"); // Import body-parser
const { dbconnect, login } = require("./db/formDb-connect.js");
const routes = require("./routes/routes.js");

const api = express();
const port = 1000;

api.use(cors());
api.use(bodyParser.json()); // Parse JSON bodies
// Middleware to parse JSON request body
api.use(express.json());
api.use("/", routes);

async function startServers() {
  try {
    await Promise.all([dbconnect(), login()]);
    console.log(`both Servers are running on port ${port}`);
  } catch (error) {
    console.error("Error starting servers:", error);
  }
}

api.listen(1000, () => {
  console.log("server is started");
});

startServers();
