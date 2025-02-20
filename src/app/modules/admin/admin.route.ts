import express from "express";
import { AdminsController } from "./admin.controller";

const router = express.Router();

// Admin authentication
router.post("/register", AdminsController.registerAdmin); // Register admin
router.post("/login", AdminsController.loginAdmin); // Admin login

// Admin management (only accessible by other admins)
router.get("/", AdminsController.getAllAdmins); // Get all admins

router
  .route("/:id")
  .get(AdminsController.getAdminById) // Get admin by ID
  .put(AdminsController.updateAdmin) // Update admin profile
  .delete(AdminsController.deleteAdmin); // Delete admin

export const AdminsRoutes = router;
