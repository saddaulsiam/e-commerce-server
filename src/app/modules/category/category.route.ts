import express from "express";
import { CategoriesController } from "./category.controller";

const router = express.Router();

router.route("/")
.post(CategoriesController.createCategory)
.get(CategoriesController.getAllCategories);

router
  .route("/:id")
  .get(CategoriesController.getCategoryById)
  .put(CategoriesController.updateCategoryById)
  .delete(CategoriesController.deleteCategoryById);

export const CategoriesRoutes = router;
