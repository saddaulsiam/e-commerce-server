const router = require("express").Router();

const verifyToken = require("../../middleware/verifyToken");
const paymentController = require("./payment.controller");

router.post("/create-stripe-payment-intent", verifyToken, paymentController.createPaymentIntent);

router.post("/create-sslcommerz-payment-intent", verifyToken, paymentController.createSslcommerzPaymentIntent);

router.post("/ssl-payment-success/:tran_id", verifyToken, paymentController.sslPaymentSuccess);

verifyToken, router.post("/ssl-payment-cancel/:tran_id", verifyToken, paymentController.sslPaymentCancel);

router.post("/ssl-payment-fail/:tran_id", verifyToken, paymentController.sslPaymentFail);

module.exports = router;
