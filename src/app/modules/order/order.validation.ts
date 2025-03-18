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
  productId: z.string(),
  vendorId: z.string(),
  name: z.string(),
  image: z.string().url(),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative(),
  color: z.string().optional(),
  size: z.string().optional(),
});

const createOrder = z.object({
  body: z.object({
    userId: z.string().length(24, "Invalid user ID format"),
    totalAmount: z.number().nonnegative("Total amount must be a non-negative number"),
    paymentMethod: z.enum(["stripe", "sslCommerz", "cashOnDelivery"]),
    isPaid: z.boolean().default(false),
    paymentStatus: z.enum(["unpaid", "paid", "refunded"]),
    shippingAddress: zodShippingAddress,
    status: z.enum(["pending", "processing", "shipped", "delivered", "canceled"]).default("pending"),
    subOrders: z.array(subOrderSchema).min(1, "At least one sub-order is required"),
  }),
});

export const OrderValidation = {
  createOrder,
};
