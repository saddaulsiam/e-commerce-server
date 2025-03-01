import SSLCommerzPayment from "sslcommerz-lts";
import { Stripe } from "stripe";
import config from "../../config";

const stripeClient = new Stripe(config.strip_secret_key as string);

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASS;
const is_live = false; // Set to true for live mode

//! Service to create a payment intent using Stripe
const createStripPaymentIntentService = async (totalAmount: number) => {
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: Math.round(totalAmount * 100),
    currency: "usd",
    payment_method_types: ["card"],
  });
  return paymentIntent.client_secret;
};

//! Service to create a payment intent using SSLCommerz
const createSSLPaymentIntentService = async (data) => {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const gatewayPageURL = await sslcz.init(data).then((apiResponse) => apiResponse.GatewayPageURL); // Return the gateway page URL
  return gatewayPageURL;
};

/*
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
}; */

export const PaymentServices = {
  createStripPaymentIntentService,
  createSSLPaymentIntentService,
};
