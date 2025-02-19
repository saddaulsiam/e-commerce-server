const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = mongoose.Schema(
  {
    user: {
      displayName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      id: {
        type: ObjectId,
        required: true,
      },
    },

    shippingAddress: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
        required: true,
      },
      region: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },

    products: [{ type: Object }],

    paymentDetails: {
      type: Object,
      required: true,
    },

    orderStatus: {
      type: String,
      required: true,
      enum: {
        values: ["pending", "reject", "cancel", "delivery"],
        message: " status can't be {VALUE} ",
      },
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: {
        values: ["unpaid", "paid"],
        message: "status can't be {VALUE} ",
      },
    },

    total: {
      type: Number,
      required: true,
    },

    orderDate: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
