import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "State is required"),
  fullAddress: z.string().min(1, "Full address is required"),
});

const createVendor = z.object({
  body: z.object({
    userId: z.string().length(24, "Invalid user ID format"),
    storeName: z.string().min(1, "Store name is required"),
    storeDescription: z.string().min(1, "Store description is required"),
    storeLogo: z.string().url("Invalid store logo URL").optional(),
    storeBanner: z.string().url("Invalid store banner URL").optional(),
    address: addressSchema,
  }),
});

export const VendorValidation = {
  createVendor,
};
