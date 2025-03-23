import httpStatus from "http-status";
import SSLCommerzPayment from "sslcommerz-lts";
import { Stripe } from "stripe";
import config from "../../config";
import Order from "../../Schema/Order";
import SubOrder from "../../Schema/SubOrder";
import { OrderServices } from "../order/order.service";
import { PaymentStatus, TOrder } from "../order/order.interface";
import AppError from "../../errors/AppError";

const stripeClient = new Stripe(config.strip_secret_key as string);

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
const createSSLPaymentIntentService = async (data: TOrder): Promise<string> => {
  //  create an order
  const order = await OrderServices.createOrderService(data);

  // Generate a unique transaction id
  const tran_id = order.order._id.toString();

  // Prepare the order data required by SSLCommerz
  const initData = {
    total_amount: data.totalAmount,
    currency: "BDT",
    tran_id, // unique transaction id for each API call
    success_url: `https://siam-store-server.vercel.app/api/v1/payment/ssl-payment-success/${tran_id}`,
    fail_url: `https://siam-store-server.vercel.app/api/v1/payment/ssl-payment-fail/${tran_id}`,
    cancel_url: `https://siam-store-server.vercel.app/api/v1/payment/ssl-payment-fail/${tran_id}`,
    ipn_url: `https://siam-store-server.vercel.app/api/v1/payment/ssl-payment-fail/${tran_id}`,
    shipping_method: "Courier",
    product_name: data.subOrders.map((product) => product.name).join(", "),
    product_category: "Electronics",
    product_profile: data.subOrders.map((product) => product.image).join(", "),
    cus_name: data.shippingAddress?.name,
    cus_email: data.shippingAddress?.email,
    cus_add1: data.shippingAddress.address,
    cus_add2: data.shippingAddress.area,
    cus_city: data.shippingAddress.city,
    cus_state: data.shippingAddress.street,
    cus_postcode: 1000,
    cus_country: "Bangladesh",
    cus_phone: data.shippingAddress.phoneNumber,
    cus_fax: "",
    ship_name: data.shippingAddress?.name,
    ship_add1: data.shippingAddress?.address,
    ship_add2: data.shippingAddress?.area,
    ship_city: data.shippingAddress?.city,
    ship_state: data.shippingAddress?.street,
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  // Initialize SSLCommerz with your credentials and environment mode
  const sslcz = new SSLCommerzPayment(config.sslcommerz.store_id, config.sslcommerz.store_pass, false); // Set to true for live mode

  // Call the init method with orderData and extract the GatewayPageURL from the response
  const response = await sslcz.init(initData);

  if (response.status === "SUCCESS") {
    return response.GatewayPageURL;
  } else {
    await sslPaymentFailOrCancelService(tran_id);
    throw new AppError(httpStatus.BAD_REQUEST, "Something want wong!", response);
  }
};

//! Service to update order payment status to "paid" after successful payment with SSLCommerz
const sslPaymentSuccessService = async (tranId: string) => {
  await Order.findByIdAndUpdate(
    {
      _id: tranId,
    },
    { $set: { isPaid: true, paymentStatus: PaymentStatus.PAID } },
    { new: true }
  );

  await SubOrder.updateMany(
    {
      orderId: tranId,
    },
    { $set: { isPaid: true, paymentStatus: PaymentStatus.PAID } },
    { new: true }
  );

  return { message: "Update successfully" };
};

//! Service to delete order if payment fails or is canceled with SSLCommerz
const sslPaymentFailOrCancelService = async (tranId: string) => {
  await Order.findByIdAndDelete(
    {
      _id: tranId,
    },
    { $set: { isPaid: true } }
  );

  await SubOrder.deleteMany(
    {
      orderId: tranId,
    },
    { $set: { isPaid: true } }
  );

  return { message: "Delete successfully" };
};

export const PaymentServices = {
  createStripPaymentIntentService,
  createSSLPaymentIntentService,
  sslPaymentSuccessService,
  sslPaymentFailOrCancelService,
};
