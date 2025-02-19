const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const brandSchema = mongoose.Schema(
  {
    products: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],

    name: {
      type: String,
      trim: true,
      required: [true, "Please provide a brnad name"],
      maxLength: 100,
      unique: true,
      lowercase: true,
    },

    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    website: {
      type: String,
      validate: [validator.isURL, "Please provide a valid website url"],
    },

    location: String,

    description: String,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // supplier: [
    //   {
    //     name: String,
    //     contanctNumber: String,
    //     id: {
    //       type: ObjectId,
    //       ref: "Vendor",
    //     },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
