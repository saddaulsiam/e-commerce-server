import express from "express";
import { UsersController } from "./user.controller";

const router = express.Router();

router.get("/", UsersController.getAllUsers); // Get all users

router
  .route("/:id")
  .get(UsersController.getUserById) // Get user by ID
  .delete(UsersController.deleteUser); // Delete user

router
  .route("/:id/profile")
  .get(UsersController.getUserProfile) // Get user profile
  .put(UsersController.updateUserProfile); // Update user profile

export const UsersRoutes = router;
