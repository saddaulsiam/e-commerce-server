import { Stripe } from "stripe";

// Initialize Stripe with your secret key (Ensure to use the correct one)
const stripeClient = new Stripe(
  "sk_test_51NkLj1AkOdLWdOingsKDKbyBYjEcuFwfaox3WDt2qUkiuoTyV84fpER6T2O8g3n1REfxPfbF8ccsELNLH46rOoKP00rvlejBAw"
);

// Service to create a payment intent using Stripe
const createPaymentIntentService = async (totalAmount: number) => {
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: Math.round(totalAmount * 100),
    currency: "usd",
    payment_method_types: ["card"],
  });
  return paymentIntent.client_secret;
};

export const PaymentServices = {
  createPaymentIntentService,
};
