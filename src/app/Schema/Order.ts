import mongoose from "mongoose";

// Enum constants for reusability
export const PAYMENT_METHODS = ["stripe", "sslCommerz", "cashOnDelivery"] as const;
export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
export const PAYMENT_STATUS = ["unpaid", "paid", "refunded"] as const;

// Shipping Address Schema (Modular & Reusable)
export const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Invalid email address"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^\d{11,11}$/, "Invalid phone number"], // Ensures valid number format
  },
  region: {
    type: String,
    required: [true, "Region is required"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  area: {
    type: String,
    required: [true, "Area is required"],
    trim: true,
  },
  street: {
    type: String,
    required: [true, "Street is required"],
    trim: true,
  },
});

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
      default: "unpaid",
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },
    subOrders: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubOrder",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
