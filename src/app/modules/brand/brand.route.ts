import express from "express";
import { BrandsController } from "./brand.controller";

const router = express.Router();

/* authorization("vendor-admin", "admin"), */

router.route("/")
.post(BrandsController.createBrand)
.get(BrandsController.getBrands);

router
  .route("/:id")
  .get(BrandsController.getBrandById)
  .put(BrandsController.updateBrandById)
  .delete(BrandsController.deleteBrandById);

export const BrandsRoutes = router;
