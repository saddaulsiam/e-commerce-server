import express from "express";
import { UsersControllers } from "./user.controller";

const router = express.Router();

router.get("/", UsersControllers.getAllUsers); // Get all users

router
  .route("/:id")
  .get(UsersControllers.getUserById) // Get user by ID
  .delete(UsersControllers.deleteUser); // Delete user

router
  .route("/:id/profile")
  .get(UsersControllers.getUserProfile) // Get user profile
  .put(UsersControllers.updateUserProfile); // Update user profile

export const UsersRoutes = router;
