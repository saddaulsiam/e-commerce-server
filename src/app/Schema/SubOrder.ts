import mongoose from "mongoose";
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUS, shippingAddressSchema } from "./Order";

const SubOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    item: {
      name: { type: String, required: true, trim: true },
      image: { type: String, required: true },
      size: { type: String, required: false },
      color: { type: String, required: false },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true,
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
    },
    isPaid: {
      type: Boolean,
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
  },
  { timestamps: true }
);

export default mongoose.model("SubOrder", SubOrderSchema);
