import express from "express";
import { ProductsController } from "./product.controller";

const router = express.Router();

router
  .route("/")
  .post(ProductsController.createProduct) // Create a new product
  .get(ProductsController.getAllProducts); // Get all products

router
  .route("/:id")
  .get(ProductsController.getProductById) // Get product by ID
  .put(ProductsController.updateProduct) // Update a product
  .delete(ProductsController.deleteProduct); // Delete a product

router.post("/review/:id", ProductsController.makeProductReview); // make review

router.get("/vendor/:vendorId", ProductsController.getProductsByVendor); // Get products by vendor

export const ProductsRoutes = router;
