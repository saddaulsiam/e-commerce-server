import { z } from "zod";

const createBrand = z.object({
  body: z.object({
    name: z.string().min(1, "Brand name is required"),
    description: z.string().optional(),
    logo: z.string().url("Invalid logo URL").optional(),
  }),
});

export const BrandValidation = {
  createBrand,
};
