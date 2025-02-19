import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    address: [
      {
        region: { type: String, required: true },
        city: { type: String, required: true },
        area: { type: String, required: true },
        fullAddress: { type: String, required: true },
      },
    ],
    photo: { type: String, default: "" },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);
