import express from "express";
import { UserController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post("/register", validateRequest(AuthValidation.createUser), UserController.register);

router.post("/login", UserController.login);

export const AuthRoutes = router;
