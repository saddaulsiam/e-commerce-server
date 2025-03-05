import mongoose from "mongoose";

const nestedSubcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false }
);

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    href: { type: String, required: false },
    subcategories: [nestedSubcategorySchema],
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    subcategories: [subcategorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
