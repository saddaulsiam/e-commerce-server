import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    email: { type: String, required: true },
    storeName: { type: String, required: true },
    storeDescription: { type: String, required: true },
    storeLogo: { type: String, default: "" },
    storeBanner: { type: String, default: "" },
    phoneNumber: { type: Number },
    address: {
      region: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String, required: true },
      street: { type: String, required: true },
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    earnings: { type: Number, default: 0 },
    status: { type: String, enum: ["inactive", "active", "block"], default: "inactive" },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
