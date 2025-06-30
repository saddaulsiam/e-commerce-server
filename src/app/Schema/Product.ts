import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Supplier is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      required: [true, "Discount is required"],
      min: [0, "Discount cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    images: [
      {
        type: String,
        required: [true, "At least one image is required"],
        validate: {
          validator: function (images: string[]) {
            return images.length > 0;
          },
          message: "At least one image is required",
        },
      },
    ],
    colors: [
      {
        type: String,
        required: [true, "At least one color is required"],
        validate: {
          validator: function (colors: string[]) {
            return colors.length > 0;
          },
          message: "At least one color is required",
        },
      },
    ],
    reviews: [
      {
        name: {
          type: String,
          required: [true, "Reviewer name is required"],
          trim: true,
        },
        photo: {
          type: String,
          default: "",
        },
        rating: {
          type: Number,
          required: [true, "Rating is required"],
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot exceed 5"],
        },
        message: {
          type: String,
          trim: true,
          maxlength: [500, "Review message cannot exceed 500 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: {
        values: ["in-stock", "out-of-stock", "discontinued", "active", "block", "deleted"],
        message: "Status must be either 'in-stock', 'out-of-stock', or 'discontinued'",
      },
      default: "in-stock",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
