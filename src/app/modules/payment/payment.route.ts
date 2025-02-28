import express from "express";
import auth from "../../middleware/auth";
import { PaymentController } from "./payment.controller";
import validateRequest from "../../middleware/validateRequest";
import { PaymentValidation } from "./payment.validation";

const router = express.Router();

router.post(
  "/create-stripe-payment-intent",
  auth("customer"),
  validateRequest(PaymentValidation.createPaymentIntent),
  PaymentController.createPaymentIntent
);

export const PaymentRoutes = router;
