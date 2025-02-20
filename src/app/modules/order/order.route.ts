import express from "express";
import { OrdersController } from "./order.controller";

const router = express.Router();

router
  .route("/")
  .post(OrdersController.createOrder) // Create a new order
  .get(OrdersController.getAllOrders); // Get all orders (for Admin)

router.get("/user/:userId", OrdersController.getUserOrders); // Get orders for a specific user

router.get("/:id", OrdersController.getOrderById); // Get order by ID

router.put("/:id/status", OrdersController.updateOrderStatus); // Update order status

// router.put("/:id/payment", OrdersController.makePayment); // Update payment status

export const OrdersRoutes = router;
