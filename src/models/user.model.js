const mongoose = require("mongoose");
const { findConfigFile } = require("typescript");
const bcrypt = require("bcryptjs");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const { User } = require(".");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        return validator.isEmail(value)
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    walletMoney: {
      type: Number,
      required: true,
      default: 500
    },
    address: {
      type: String,
      default: config.default_address,
    },
    addresses: [{
      address: {
        type: String,
        required: true,
        trim: true,
      }
    }],
  },
  {
    timestamps: true,
  }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  try{
    const result = await this.findOne({email: email});
    if (result) return true;
    else return false;
  }
  catch(err){
    return false;
  }
};


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS

/**
 * Check if entered password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password, userPassword) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) return false;
  return true;
}
/**
 * Check if user have set an address other than the default address
 * - should return true if user has set an address other than default address
 * - should return false if user's address is the default address
 *
 * @returns {Promise<boolean>}
 */
userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
  return user.addresses && user.addresses.length > 0;
};

/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */

const userModel = mongoose.model("User", userSchema);

/**
 * @typedef User
 */

let exportObj = {User:userModel};

module.exports = exportObj;
