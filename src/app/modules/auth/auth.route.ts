import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middleware/auth";
import { AuthControllers } from "./auth.controller";

const router = express.Router();

router.post("/register", validateRequest(AuthValidation.createUser), AuthControllers.register);

router.post("/login", validateRequest(AuthValidation.loginUser), AuthControllers.login);
router.post("/refresh-token", AuthControllers.refreshToken);

router.get("/me", auth("admin", "customer", "vendor", "superAdmin"), AuthControllers.getMe);

export const AuthRoutes = router;
