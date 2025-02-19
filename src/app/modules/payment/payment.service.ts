const stripe = require("stripe")(
  "sk_test_51NkLj1AkOdLWdOingsKDKbyBYjEcuFwfaox3WDt2qUkiuoTyV84fpER6T2O8g3n1REfxPfbF8ccsELNLH46rOoKP00rvlejBAw"
);

// sslcommerz
const SSLCommerzPayment = require("sslcommerz-lts");
const Order = require("../models/Order");
const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASS;
const is_live = false; //true for live, false for sandbox

exports.createPaymentIntentService = async (totalPrice) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100,
    currency: "usd",
    payment_method_types: ["card"],
  });
  return paymentIntent.client_secret;
};

exports.createSslcommerzPaymentIntentService = async (data) => {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const gatewayPageURL = await sslcz
    .init(data)
    .then((apiResponse) => apiResponse.GatewayPageURL);
  return gatewayPageURL;
};

exports.sslPaymentSuccessService = async (tranId) => {
  const order = await Order.findOneAndUpdate(
    {
      "paymentDetails.tran_id": tranId,
    },
    { $set: { paymentStatus: "paid" } }
  );
  return order;
};

exports.sslPaymentFileOrCancelService = async (tranId) => {
  const order = await Order.findOneAndDelete({
    "paymentDetails.tran_id": tranId,
  });
  return order;
};
