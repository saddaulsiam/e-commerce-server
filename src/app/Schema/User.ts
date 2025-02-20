import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "vendor"], required: true },
    isEmailVerified: { type: Boolean, default: false },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
