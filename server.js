const express = require("express");
const cors = require("cors");
const api = express();
const { ObjectId } = require("mongodb");

api.use(cors());

const dbconnect = require("./formDb-connect.js");

// Middleware to parse JSON request body
api.use(express.json());

api.post("/formdata", async (req, resp) => {
  const formData = req.body;
  console.log(formData);
  let data = await dbconnect();
  let result = await data.insertOne(req.body);
  //console.log(result);
  resp.json({ message: "Form data received successfully" });
});

api.get("/get", async (req, resp) => {
  let data = await dbconnect();
  data = await data.find().toArray();

  //console.log(data);
  resp.send(data);
});

api.delete("/delete/:userId", async (req, resp) => {
  //console.log("deleted api runned");
  const userId = req.params.userId;
  let data = await dbconnect();
  let result = await data.deleteOne({ _id: new ObjectId(userId) });
  console.log(result);
  resp.send("user deleted successfully");
});

api.put("/update", async (req, resp) => {
  let db = await dbconnect();
  let result = await db.updateOne(
    { _id: new ObjectId("65df1c6042b1e2b1cf1e3987") },
    { $set: { name: "sara" } }
  );
  resp.send("record is updated successfully");
});

api.listen(1000, () => console.log("server is running on port 1000"));
