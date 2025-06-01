import mongoose from "mongoose";

const visitorLogSchema = new mongoose.Schema(
  {
    ip: { type: String },
    userAgent: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const VisitorLog = mongoose.model("VisitorLog", visitorLogSchema);
