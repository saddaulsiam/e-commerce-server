import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";
import config from "../../config";

//! Creating strip payment intent
const createStipePaymentIntent = catchAsync(async (req, res) => {
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
  const intent = await PaymentServices.createSSLPaymentIntentService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully!",
    data: { gatewayPageURL: intent },
  });
});

const sslPaymentSuccess = catchAsync(async (req, res) => {
  await PaymentServices.sslPaymentSuccessService(req.params.id);

  res.redirect(config.next_public_base_url + "/payment/success");
});

const sslPaymentFail = catchAsync(async (req, res) => {
  await PaymentServices.sslPaymentFailOrCancelService(req.params.id);

  res.redirect(config.next_public_base_url + "/payment/fail");
});

export const PaymentController = {
  createStipePaymentIntent,
  createSSLPaymentIntent,
  sslPaymentSuccess,
  sslPaymentFail,
};
