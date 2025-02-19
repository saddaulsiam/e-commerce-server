const router = require("express").Router();

const verifyToken = require("../../middleware/verifyToken");
const orderController = require("../controllers/order.controller");
const authorization = require("../../middleware/authorization");

router
  .route("/")
  .post(verifyToken, orderController.orderNow)
  .get(authorization("vendor-admin", "admin"), orderController.getOrders);

router.get("/:id", verifyToken, orderController.getOrderById);

router.get(
  "/my/:email",
  authorization("customer", "vendor-admin", "admin"),
  orderController.getMyOrdersByEmail
);

module.exports = router;
