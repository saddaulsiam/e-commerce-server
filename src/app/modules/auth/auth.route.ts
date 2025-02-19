import express from "express";
import { UserController } from "./auth.controller";

const router = express.Router();

router.route("/").post(UserController.register);
// .get(/* authorization("vendor-admin", "admin"), */ UserController.getAllUsers);

// router.route("/:email").get(UserController.getMe).patch(/*authorization("customer", "admin"), */ UserController.update);

// router.route("/address/:id");
// .post(authorization("customer", "admin"), UserController.addAddress)
// .delete(authorization("customer", "admin"), UserController.removeAddress);

export const AuthRoutes = router;
