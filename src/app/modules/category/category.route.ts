import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { CategoriesController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(CategoryValidation.createCategory), CategoriesController.createCategory)
  .get(CategoriesController.getAllCategories);

router
  .route("/:id")
  .get(CategoriesController.getCategoryById)
  .put(CategoriesController.updateCategoryById)
  .delete(CategoriesController.deleteCategoryById);

export const CategoriesRoutes = router;
