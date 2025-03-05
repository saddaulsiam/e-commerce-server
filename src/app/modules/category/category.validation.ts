import { z } from "zod";

const nestedSubcategorySchema = z.object({
  name: z.string().min(1, "Nested Subcategory name is required"),
  href: z.string().min(1, "Nested Subcategory URL is required"),
});

const subcategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required"),
  href: z.string().optional(),
  subcategories: z.array(nestedSubcategorySchema).optional(),
});

const createCategory = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    subcategories: z.array(subcategorySchema),
  }),
});

export const CategoryValidation = {
  createCategory,
};
