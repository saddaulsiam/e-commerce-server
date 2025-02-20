import stripe from "stripe";
import SSLCommerzPayment from "sslcommerz-lts";
import Order from "../../Schema/Order";

const stripeClient = stripe(
  "sk_test_51NkLj1AkOdLWdOingsKDKbyBYjEcuFwfaox3WDt2qUkiuoTyV84fpER6T2O8g3n1REfxPfbF8ccsELNLH46rOoKP00rvlejBAw"
);

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASS;
const is_live = false; // Set to true for live mode

//! Service to create a payment intent using Stripe
const createPaymentIntentService = async (totalPrice) => {
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: totalPrice * 100, // Convert to the smallest unit (e.g., cents for USD)
    currency: "usd",
    payment_method_types: ["card"],
  });
  return paymentIntent.client_secret; // Return the client secret for frontend
};

//! Service to create a payment intent using SSLCommerz
const createSslcommerzPaymentIntentService = async (data) => {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const gatewayPageURL = await sslcz.init(data).then((apiResponse) => apiResponse.GatewayPageURL); // Return the gateway page URL
  return gatewayPageURL;
};

//! Service to update order payment status to "paid" after successful payment with SSLCommerz
const sslPaymentSuccessService = async (tranId) => {
  const order = await Order.findOneAndUpdate(
    {
      "paymentDetails.tran_id": tranId,
    },
    { $set: { paymentStatus: "paid" } },
    { new: true } // Ensure it returns the updated order
  );
  return order; // Return the updated order
};

//! Service to delete order if payment fails or is canceled with SSLCommerz
const sslPaymentFileOrCancelService = async (tranId) => {
  const order = await Order.findOneAndDelete({
    "paymentDetails.tran_id": tranId,
  });
  return order; // Return the deleted order
};

export const PaymentServices = {
  createPaymentIntentService,
  createSslcommerzPaymentIntentService,
  sslPaymentSuccessService,
  sslPaymentFileOrCancelService,
};
