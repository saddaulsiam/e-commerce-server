import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    logo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);
