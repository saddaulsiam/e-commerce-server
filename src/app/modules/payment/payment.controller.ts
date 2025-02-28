import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

//! Creating a payment intent
const createPaymentIntent = catchAsync(async (req, res) => {
  const totalAmount = parseFloat(req.body.totalAmount.toFixed(2));

  const clientSecret = await PaymentServices.createPaymentIntentService(totalAmount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully!",
    data: { clientSecret },
  });
});

/* 
const createSslcommerzPaymentIntent = catchAsync(async (req, res) => {
  const tran_id = new Types.ObjectId().toString();
  const order = await req.body;
  order.paymentDetails.tran_id = tran_id;

  const data = {
    total_amount: order.total,
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
    ship_name: order.shippingAddress.name,
    ship_add1: order.shippingAddress.address,
    ship_add2: order.shippingAddress.area,
    ship_city: order.shippingAddress.city,
    ship_state: order.shippingAddress.region,
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  // create order on database
  // await orderNowService(order); //! need work hare

  const intent = await PaymentServices.createSslcommerzPaymentIntentService(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully!",
    data: { gatewayPageURL: intent },
  });
});

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
  // createSslcommerzPaymentIntent,
  // sslPaymentSuccess,
  // sslPaymentFail,
  // sslPaymentCancel,
};
