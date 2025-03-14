import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["customer", "vendor"], default: "customer" },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
