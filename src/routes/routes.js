const express = require("express");
const router = express.Router();

const {
  signupForm,
  loginForm,
  insertFormData,
  getFormData,
  deleteFormData,
  updateFormData,
} = require("../controllers/controller.js");

const { verifyToken, secretKey } = require("../../public/js/token.js");

router.post("/signup", signupForm);
router.post("/login", loginForm);
router.post("/formdata", insertFormData);

router.get("/get", getFormData);
router.delete("/delete/:userId", deleteFormData);
router.put("/update/:userId", updateFormData);
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected data" });
});

module.exports = router;
