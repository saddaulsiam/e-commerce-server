import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoriesServices } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const result = await CategoriesServices.createCategoryService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully!",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoriesServices.getAllCategoriesService();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully!",
    data: result,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const categoryId = req.params.id;
  const result = await CategoriesServices.getCategoryByIdService(categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully!",
    data: result,
  });
});

const updateCategoryById = catchAsync(async (req, res) => {
  const categoryId = req.params.id;
  const updateData = req.body;
  const result = await CategoriesServices.updateCategoryService(categoryId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully!",
    data: result,
  });
});

const deleteCategoryById = catchAsync(async (req, res) => {
  const categoryId = req.params.id;
  const result = await CategoriesServices.deleteCategoryService(categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully!",
    data: result,
  });
});

export const CategoriesController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
