import { z } from "zod";

const createAdmin = z.object({
  body: z.object({
    displayName: z.string().min(1, "Display name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

const makeAdmin = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required!" }).email("Invalid email format"),
  }),
});

export const AdminValidation = {
  createAdmin,
  makeAdmin,
};
