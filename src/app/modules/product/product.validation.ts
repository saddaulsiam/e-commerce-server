import { z } from "zod";

const createProduct = z.object({
  body: z.object({
    vendorId: z.string().length(24, "Invalid vendor ID format"),
    name: z.string().min(1, "Product name is required"),
    category: z.string().length(24, "Invalid category ID format"),
    images: z.array(z.string().url("Invalid image URL")),
    description: z.string().optional(),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
    status: z.enum(["instock", "outofstock", "discontinued"]),
    colors: z.array(z.object({ label: z.string(), color: z.string() })),
    brand: z.string({ required_error: "Brand is required" }),
    price: z.number().positive("Price must be a positive number"),
    discount: z.number().positive("Discount must be a positive number"),
  }),
});

export const ProductValidation = {
  createProduct,
};
