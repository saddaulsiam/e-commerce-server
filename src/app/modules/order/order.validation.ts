import { z } from "zod";

const zodShippingAddress = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().nonempty("Phone number is required"),
  street: z.string().nonempty("Street is required"),
  city: z.string().nonempty("City is required"),
  area: z.string().nonempty("Area is required"),
  address: z.string().nonempty("Address is required"),
});

const subOrderSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  productId: z.string().length(24, "Invalid product ID format"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  vendorId: z.string().length(24, "Invalid vendor ID format"),
});

const createOrder = z.object({
  body: z.object({
    userId: z.string().length(24, "Invalid user ID format"),
    totalAmount: z.number().nonnegative("Total amount must be a non-negative number"),
    paymentMethod: z.enum(["stripe", "sslCommerz", "cashOnDelivery"]),
    status: z.enum(["pending", "processing", "shipped", "delivered", "canceled"]).default("pending"),
    shippingAddress: zodShippingAddress,
    subOrders: z.array(subOrderSchema).min(1, "At least one sub-order is required"),
  }),
});

export const OrderValidation = {
  createOrder,
};
