import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { UsersControllers } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/", auth("admin"), UsersControllers.getAllUsers); // Get all users

router
  .route("/:id")
  .get(UsersControllers.getUserById) // Get user by ID
  .delete(UsersControllers.deleteUser); // Delete user

router
  .route("/:id/profile")
  .get(UsersControllers.getUserProfile) // Get user profile
  .put(auth("customer", "vendor", "admin"), UsersControllers.updateUserProfile); // Update user profile

router
  .route("/:id/address")
  .post(auth("customer", "vendor", "admin"), validateRequest(UserValidation.newAddress), UsersControllers.addNewAddress) // Add new address
  .delete(auth("customer", "vendor", "admin"), UsersControllers.deleteAddress); // Delete address

export const UsersRoutes = router;
