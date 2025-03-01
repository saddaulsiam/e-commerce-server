import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";
import { Types } from "mongoose";

//! Creating strip payment intent
const createPaymentIntent = catchAsync(async (req, res) => {
  const totalAmount = parseFloat(req.body.totalAmount.toFixed(2));

  const clientSecret = await PaymentServices.createStripPaymentIntentService(totalAmount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully!",
    data: { clientSecret },
  });
});

//! Creating SSL payment intent
const createSSLPaymentIntent = catchAsync(async (req, res) => {
  const tran_id = new Types.ObjectId().toString();
  const orderData = await req.body;
  orderData.paymentDetails.tran_id = tran_id;

  const data = {
    total_amount: orderData.totalAmount,
    currency: "BDT",
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `http://localhost:5000/api/v1/payment/ssl-payment-success/${tran_id}`,
    fail_url: `http://localhost:5000/api/v1/payment/ssl-payment-fail/${tran_id}`,
    cancel_url: "http://localhost:5000/api/v1/payment/ssl-payment-cancel",
    ipn_url: "http://localhost:5000/api/v1/payment/ssl-payment-ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: orderData.shippingAddress.name,
    ship_add1: orderData.shippingAddress.address,
    ship_add2: orderData.shippingAddress.area,
    ship_city: orderData.shippingAddress.city,
    ship_state: orderData.shippingAddress.region,
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const intent = await PaymentServices.createSSLPaymentIntentService(orderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully!",
    data: { gatewayPageURL: intent },
  });
});

/* 
const sslPaymentSuccess = catchAsync(async (req, res) => {
  await PaymentServices.sslPaymentSuccessService(req.params.tran_id);

  res.redirect("http://localhost:3000/payment/success");
});

const sslPaymentFail = catchAsync(async (req, res) => {
  await PaymentServices.sslPaymentFileOrCancelService(req.params.tran_id);

  res.redirect("http://localhost:3000/payment/fail");
});

const sslPaymentCancel = catchAsync(async (req, res) => {
  await PaymentServices.sslPaymentFileOrCancelService(req.params.tran_id);

  res.redirect("http://localhost:3000/payment");
});
 */
export const PaymentController = {
  createPaymentIntent,
  createSSLPaymentIntent,
  // sslPaymentSuccess,
  // sslPaymentFail,
  // sslPaymentCancel,
};
