import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { VendorsController } from "./vendor.controller";
import { VendorValidation } from "./vendor.validation";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(VendorValidation.createVendor), VendorsController.createVendor) // Create a new vendor
  .get(auth("admin", "vendor"), VendorsController.getAllVendors); // Get all vendors

router.get("/:name", VendorsController.getVendorByName); // Get vendor by name

router
  .route("/:id")
  .get(auth("admin", "vendor"), VendorsController.getVendorByUserId) // Get vendor by ID
  .put(auth("admin", "vendor"), VendorsController.updateVendor) // Update a vendor
  .delete(auth("admin", "vendor"), VendorsController.deleteVendor); // Delete a vendor

// Get customers by vendor
router.get("/:id/customers", auth("vendor"), VendorsController.getVendorCustomers);

// Get Dashboard Meta Data
router.get("/dashboard/meta", auth("vendor"), VendorsController.getVendorDashboardMeta);

export const VendorsRoutes = router;
