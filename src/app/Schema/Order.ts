import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    isPaid: { type: Boolean, required: true, default: false },
    status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
    shippingAddress: { type: String, required: true },
    subOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubOrder" }],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
