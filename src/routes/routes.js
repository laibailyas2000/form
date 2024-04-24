const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const {
  loginForm,
  insertFormData,
  getFormData,
  deleteFormData,
  updateFormData,
} = require("../controllers/controller.js");

router.post("/login", loginForm);
router.post("/formdata", insertFormData);
router.get("/get", getFormData);
router.delete("/delete/:userId", deleteFormData);
router.put("/update/:userId", updateFormData);

module.exports = router;
