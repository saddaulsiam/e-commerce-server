import express from "express";
import { UsersControllers } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";

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

router
  .route("/:id/address")
  .post(validateRequest(UserValidation.newAddress), UsersControllers.AddNewAddress) // Add new address
  .delete(); // Delete address //! add korte hobe;

export const UsersRoutes = router;
