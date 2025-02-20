import { z } from "zod";

const createProduct = z.object({
  body: z.object({
    vendorId: z.string().length(24, "Invalid vendor ID format"),
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be a positive number"),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
    category: z.string().length(24, "Invalid category ID format"),
    brand: z.string().length(24, "Invalid brand ID format"),
    images: z.array(z.string().url("Invalid image URL")),
  }),
});

export const ProductValidation = {
  createProduct,
};
