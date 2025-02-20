import { z } from "zod";

export const subOrderSchema = z.object({
  productId: z.string().length(24, "Invalid product ID format"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  vendorId: z.string().length(24, "Invalid vendor ID format"),
  status: z.enum(["pending", "processing", "shipped", "delivered", "canceled"]),
});

const createOrder = z.object({
  body: z.object({
    userId: z.string().length(24, "Invalid user ID format"),
    totalAmount: z.number().nonnegative("Total amount must be a non-negative number"),
    paymentMethod: z.enum(["online", "cod"]),
    status: z.enum(["pending", "processing", "shipped", "delivered", "canceled"]).default("pending"),
    subOrders: z.array(subOrderSchema).min(1, "At least one sub-order is required"),
  }),
});

export const OrderValidation = {
  createOrder,
};
