//this file is used to connect your mongodb database with vs code

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

//connect to form values
async function dbconnect() {
  let result = await client.connect();
  db = result.db("formValues");
  return db.collection("input");
}

//connect to login value
async function login() {
  let result = await client.connect();
  db = result.db("formValues");
  return db.collection("loginValues");
}

module.exports = { login, dbconnect };
