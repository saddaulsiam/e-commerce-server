import { z } from "zod";

const createCategory = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    image: z.string().url("Invalid image URL").optional(),
  }),
});

export const CategoryValidation = {
  createCategory,
};
