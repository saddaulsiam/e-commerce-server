import express from "express";
import { VendorsController } from "./vendor.controller";
import validateRequest from "../../middleware/validateRequest";
import { VendorValidation } from "./vendor.validation";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(VendorValidation.createVendor), VendorsController.createVendor) // Create a new vendor
  .get(VendorsController.getAllVendors); // Get all vendors

router
  .route("/:id")
  .put(VendorsController.getVendorById) // Get vendor by ID
  .get(VendorsController.updateVendor) // Update a vendor
  .delete(VendorsController.deleteVendor); // Delete a vendor

router.get("/vendor/:vendorId", VendorsController.getVendorProducts); // Get products by vendor

export const VendorsRoutes = router;
