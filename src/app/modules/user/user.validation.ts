import { z } from "zod";

const newAddress = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").optional(),
    phoneNumber: z.string().min(11, "Phone number must be 11 digits").max(11, "Phone number must be 11 digits"),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    address: z.string().min(5, "Address must be at least 5 characters long"),
  }),
});

export const UserValidation = {
  newAddress,
};
