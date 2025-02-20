import { z } from "zod";

const createUser = z.object({
  body: z.object({
    displayName: z.string().min(1, "Name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const AuthValidation = {
  createUser,
};
