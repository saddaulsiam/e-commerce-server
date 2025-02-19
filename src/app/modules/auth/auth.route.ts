import express from "express";
import { UserController } from "./auth.controller";

const router = express.Router();

router.post("/register", UserController.register);

router.post("/login", UserController.login);

export const AuthRoutes = router;
