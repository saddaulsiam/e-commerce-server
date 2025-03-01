import express from "express";
import auth from "../../middleware/auth";
import { PaymentController } from "./payment.controller";
import validateRequest from "../../middleware/validateRequest";
import { PaymentValidation } from "./payment.validation";
import { OrderValidation } from "../order/order.validation";

const router = express.Router();

router.post(
  "/create-stripe-payment-intent",
  auth("customer"),
  validateRequest(PaymentValidation.createStripPaymentIntent),
  PaymentController.createStipePaymentIntent
);

router.post(
  "/create-ssl-payment-intent",
  auth("customer"),
  validateRequest(OrderValidation.createOrder),
  PaymentController.createSSLPaymentIntent
);

router.post("/ssl-payment-success/:id", PaymentController.sslPaymentSuccess);

router.post("/ssl-payment-cancel/:id", PaymentController.sslPaymentCancel);

export const PaymentRoutes = router;
