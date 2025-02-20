import mongoose from "mongoose";
import Profile from "./Profile"; // Import Profile model

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

// ✅ Automatically create a Profile when a new User is registered
userSchema.post("save", async function (doc) {
  if (!doc.profile) {
    const profile = await Profile.create({
      userId: doc._id,
      address: [],
      photo: "",
      orders: [],
    });

    doc.profile = profile._id;
    await doc.save();
  }
});

export default mongoose.model("User", userSchema);
