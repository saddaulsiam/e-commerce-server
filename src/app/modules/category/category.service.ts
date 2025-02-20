import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TCategory } from "./category.interface";
import Category from "../../Schema/Category";

//! Create a new category
export const createCategoryService = async (categoryData: TCategory) => {
  const { name, description, logo } = categoryData;

  // Check if category already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists");
  }

  // Create new category
  const newCategory = await Category.create({
    name,
    description,
    logo,
  });

  return newCategory;
};

//! Get all categories
export const getAllCategoriesService = async () => {
  const categories = await Category.find();
  return categories;
};

//! Get category by ID
export const getCategoryByIdService = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

//! Update category by ID
export const updateCategoryService = async (categoryId: string, updateData: Partial<TCategory>) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Update the category with provided data
  const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
  return updatedCategory;
};

//! Delete category by ID
export const deleteCategoryService = async (categoryId: string) => {
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
