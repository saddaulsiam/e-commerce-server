import express from "express";
import { OrdersController } from "./order.controller";
import validateRequest from "../../middleware/validateRequest";
import { OrderValidation } from "./order.validation";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(OrderValidation.createOrder), OrdersController.createOrder)
  .get(OrdersController.getAllOrders); // Get all orders (for Admin)

router.get("/vendor", OrdersController.getVendorOrders); // Get orders for vendor

router.get("/user/:id", OrdersController.getUserOrders); // Get orders for a specific user

router.get("/:id", OrdersController.getOrderById); // Get order by ID

router.put("/:id/status", OrdersController.updateOrderStatus); // Update order status

// router.put("/:id/payment", OrdersController.makePayment); // Update payment status

export const OrdersRoutes = router;
