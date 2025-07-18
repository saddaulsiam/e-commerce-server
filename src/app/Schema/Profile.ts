import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    address: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        region: { type: String, required: true },
        city: { type: String, required: true },
        area: { type: String, required: true },
        street: { type: String, required: true },
      },
    ],
    photo: { type: String, default: "" },
    birthDate: { type: String, default: "" },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
