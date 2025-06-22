import { z } from "zod";

const zodAddressSchema = z.object({
  street: z.string().nonempty("Street is required"),
  city: z.string().nonempty("City is required"),
  area: z.string().nonempty("Area is required"),
  region: z.string().nonempty("Address is required"),
});

const createVendor = z.object({
  body: z.object({
    userId: z.string().length(24, "Invalid user ID format"),
    storeName: z.string().min(1, "Store name is required"),
    storeDescription: z.string().min(1, "Store description is required"),
    address: zodAddressSchema,
  }),
});

export const VendorValidation = {
  createVendor,
};
