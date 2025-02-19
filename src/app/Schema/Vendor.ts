import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    storeName: { type: String, required: true },
    storeDescription: { type: String, required: true },
    storeLogo: { type: String },
    storeBanner: { type: String },
    address: {
      region: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String, required: true },
      fullAddress: { type: String, required: true },
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", VendorSchema);
