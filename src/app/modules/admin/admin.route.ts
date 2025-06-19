import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { AdminsController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = express.Router();

//! Admin authentication
router.post(
  "/register",
  auth("admin", "superAdmin"),
  validateRequest(AdminValidation.createAdmin),
  AdminsController.registerAdmin
); // Register admin

router.post("/login", AdminsController.loginAdmin); // Admin login

//! Admin management (only accessible by other admins)
router.get("/", auth("admin"), AdminsController.getAllAdmins); // Get all admins
router.get("/:email", auth("admin"), AdminsController.getAdminByEmail); // Get admin by email

router
  .route("/:id")
  .get(auth("admin"), AdminsController.getAdminById) // Get admin by ID
  .put(auth("admin"), AdminsController.updateAdmin) // Update admin profile
  .delete(auth("admin"), AdminsController.deleteAdmin); // Delete admin

// Get Dashboard Meta Data
router.get("/dashboard/meta", auth("admin"), AdminsController.getAdminDashboardMeta); // Get admin dashboard meta data

export const AdminsRoutes = router;
