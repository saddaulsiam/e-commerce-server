const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require("validator");
const crypto = require("crypto");

const vendorSchema = mongoose.Schema(
  {
    products: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],

    storeName: {
      type: String,
      lowercase: true,
      default: "",
    },

    email: {
      type: String,
      required: [true, "Please provide email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    profileImage: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
    },

    location: {
      type: String,
      default: "",
    },

    phoneNumber: {
      type: String,
      required: [true, "provide a valid number"],
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number",
      ],
    },

    role: {
      type: String,
      enum: ["customer", "vendor-admin", "admin"],
      default: "vendor-admin",
    },

    // admin: [
    //   {
    //     name: { type: String, required: true },
    //     email: {
    //       type: String,
    //       lowercase: true,
    //       validate: [validator.isEmail, "Please provide a valid email"],
    //     },
    //     password: { type: String, required: true },
    //     type: ObjectId,
    //     ref: "User",
    //   },
    // ],

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
