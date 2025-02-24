import { z } from "zod";

const createUser = z.object({
  body: z.object({
    displayName: z.string().min(1, "Name is required"),
    phoneNumber: z
      .string()
      .min(11, "Phone number is required")
      .max(11, "Phone number is required")
      .optional()
      .nullable()
      .transform((val) => (val === null ? undefined : val)), // Handle null values
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .optional()
      .nullable()
      .transform((val) => (val === null ? undefined : val)), // Handle null values
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
  }),
});

export const AuthValidation = {
  createUser,
  loginUser,
};
