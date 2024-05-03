const { ObjectId } = require("mongodb");
const { dbconnect, login } = require("../db/formDb-connect.js");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../../public/js/token.js");
// const secretKey = "bingo";

async function signupForm(req, res) {
  try {
    const loginCollection = await login();
    const { email, name, password } = req.body;
    console.log("req body is ", req.body);

    // Check if the email already exists
    const existingUser = await loginCollection.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "email already exists" });
    }

    // Insert the signup data into the collection
    const result = await loginCollection.insertOne({ email, name, password });

    res.status(200).json({
      message: "signup data inserted successfully",
      result: result,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function loginForm(req, res) {
  try {
    const loginCollection = await login();
    const { email, password } = req.body;

    // Check if the credentials match
    const user = await loginCollection.findOne({
      email: email,
      password: password,
    });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // // Generate JWT token
    console.log("generate token");
    const token = generateToken({ id: user._id, email: user.email });

    res.status(200).json({
      message: "Login successful",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: "10h" });
}
// // Protected endpoint
// function Protected(verifyToken, req, res) {
//   // If the token is verified, proceed with the protected operation
//   verifyToken(req, res, () => {
//     res.json({ message: "Protected resource accessed successfully" });
//   });
// }

// // Middleware to verify JWT token
// function verifyToken(req, resp, next) {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return resp.status(403).json({ message: "token is required" });
//   }
//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return resp.status(401).json({ message: "token in invalid" });
//     }
//     req.user = decoded; // Store decoded token data in request object
//     next();
//   });
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
  signupForm,
  loginForm,
  insertFormData,
  getFormData,
  deleteFormData,
  updateFormData,
  generateToken,
};

//const { verifyToken, generateToken } = require("../../public/js/token.js");
