const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const authMiddleware = require("../../middlewares/auth.js");

const router = express.Router();
const validateUser = validate(userValidation.getUser); 
const validateSetAdress = validate(userValidation.setAddress);

// Get user details
router.get("/:userId", authMiddleware, validateUser, userController.getUser);

// Set user address
router.put("/:userId", authMiddleware, validateSetAdress, userController.setAddress);

// Get user addresses
router.get("/:userId/addresses", authMiddleware, userController.getAddresses);

// Add new address
router.post("/:userId/addresses", authMiddleware, userController.addAddress);

// Delete address
router.delete("/:userId/addresses/:addressId", authMiddleware, userController.deleteAddress);

module.exports = router;

