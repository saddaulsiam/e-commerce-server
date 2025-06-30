import express from "express";
import { OrdersController } from "./order.controller";
import validateRequest from "../../middleware/validateRequest";
import { OrderValidation } from "./order.validation";
import auth from "../../middleware/auth";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(OrderValidation.createOrder), OrdersController.createOrder)
  .get(OrdersController.getAllOrders); // Get all orders (for Admin)

router.get("/vendor", OrdersController.getVendorOrders); // Get orders for vendor

router.get("/my", auth("customer", "vendor", "admin"), OrdersController.getUserOrders); // Get orders for a specific user

router.get("/:id", OrdersController.getOrderById); // Get order by ID

router.put("/:id/status", OrdersController.updateOrderStatus); // Update order status
router.put("/suborder/:id/status", OrdersController.updateSuborderStatus); // Update suborder status

router.get("/suborder/:id", OrdersController.getSuborderById); // Get suborder by ID

export const OrdersRoutes = router;
