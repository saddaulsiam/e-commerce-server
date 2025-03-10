import express from "express";
import { VendorsController } from "./vendor.controller";
import validateRequest from "../../middleware/validateRequest";
import { VendorValidation } from "./vendor.validation";
import auth from "../../middleware/auth";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(VendorValidation.createVendor), VendorsController.createVendor) // Create a new vendor
  .get(VendorsController.getAllVendors); // Get all vendors

router
  .route("/:id")
  .get(VendorsController.getVendorByUserId) // Get vendor by ID
  .put(VendorsController.updateVendor) // Update a vendor
  .delete(VendorsController.deleteVendor); // Delete a vendor

router.get("/:id/customers", auth("vendor"), VendorsController.getVendorCustomers); // Get customers by vendor

export const VendorsRoutes = router;
