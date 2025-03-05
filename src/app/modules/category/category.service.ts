import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Category from "../../Schema/Category";
import { TCategory } from "./category.interface";

//! Create or update a category
const createCategoryService = async (categoryData: TCategory) => {
  // Check if category already exists
  let existingCategory = await Category.findOne({ name: categoryData.name });

  if (existingCategory) {
    categoryData.subcategories?.forEach((newSubcategory) => {
      // Find if subcategory exists in Mongoose subdocument array
      const existingSubcategory = existingCategory.subcategories.find(
        (sub) => sub.name.toString() === newSubcategory.name
      );

      if (!existingSubcategory) {
        // Add new subcategory if not found
        existingCategory.subcategories.push(newSubcategory);
      } else {
        // Merge nested subcategories
        newSubcategory.subcategories?.forEach((nestedSub) => {
          const nestedExists = existingSubcategory.subcategories.some((n) => n.name.toString() === nestedSub.name);

          if (!nestedExists) {
            existingSubcategory.subcategories.push(nestedSub);
          }
        });
      }
    });

    // Save updated category
    await existingCategory.save();
    return existingCategory;
  }

  // Create new category if it doesn't exist
  const newCategory = await Category.create(categoryData);
  return newCategory;
};

//! Get all categories
const getAllCategoriesService = async () => {
  return await Category.find();
};

//! Get category by ID
const getCategoryByIdService = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

//! Update category by ID
const updateCategoryService = async (categoryId: string, updateData: Partial<TCategory>) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Update the category with provided data
  const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
  return updatedCategory;
};

//! Delete category by ID
const deleteCategoryService = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Delete the category
  await Category.findByIdAndDelete(categoryId);
  return { message: "Category deleted successfully" };
};

export const CategoriesServices = {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
};
