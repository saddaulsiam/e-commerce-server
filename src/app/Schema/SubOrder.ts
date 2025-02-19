import mongoose from "mongoose";

const SubOrderSchema = new mongoose.Schema(
  {
    parentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "online"] },
    isPaid: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("SubOrder", SubOrderSchema);
