const { ObjectId } = require("mongodb");
const { dbconnect, login } = require("../db/formDb-connect.js");

async function loginForm(req, res) {
  try {
    // Connect to the "loginValues" collection
    const loginCollection = await login();

    // Extract login data from the request body
    const { uname, password } = req.body;

    // Construct the login document
    const loginData = {
      uname: uname,
      password: password,
      // You can add more fields as needed
    };

    // Insert the login data into the collection
    const result = await loginCollection.insertOne(loginData);

    // Send a response containing both the text and the result
    res.status(200).json({
      message: "Login data inserted successfully",
      result: result, // Send the database operation result
    });
  } catch (error) {
    // Handle errors
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// async function loginForm(req, resp) {
//   try {
//     await login(); // Await the database connection
//     console.log("data recived from user", req.body);
//     resp.json({ message: "Login endpoint runned successful" });
//   } catch (error) {
//     console.error("Error during login:", error);
//     resp.status(500).send("Internal Server Error");
//   }
// }

async function insertFormData(req, resp) {
  const formData = req.body;
  console.log(formData);
  let data = await dbconnect();
  let result = await data.insertOne(req.body);
  //console.log(result);
  resp.json({ message: "Form data received successfully" });
}

async function getFormData(req, res) {
  let data = await dbconnect();
  data = await data.find().toArray();
  res.send(data);
}

async function deleteFormData(req, res) {
  const userId = req.params.userId;
  let data = await dbconnect();
  let result = await data.deleteOne({ _id: new ObjectId(userId) });
  console.log(result);
  res.send("User deleted successfully");
}

async function updateFormData(req, res) {
  const userId = req.params.userId;
  const updatedData = req.body;
  console.log(updatedData); // Assuming the request body contains the updated data
  let db = await dbconnect();
  let result = await db.updateOne(
    { _id: new ObjectId(userId) },
    { $set: updatedData } // Use the updated data from the request body
  );
  res.send(updatedData);
}

module.exports = {
  loginForm,
  insertFormData,
  getFormData,
  deleteFormData,
  updateFormData,
};
