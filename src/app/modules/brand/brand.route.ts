import express from "express";
import { BrandsController } from "./brand.controller";
import { BrandValidation } from "./brand.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(BrandValidation.createBrand), BrandsController.createBrand)
  .get(BrandsController.getBrands);

router
  .route("/:id")
  .get(BrandsController.getBrandById)
  .put(BrandsController.updateBrandById)
  .delete(BrandsController.deleteBrandById);

export const BrandsRoutes = router;
