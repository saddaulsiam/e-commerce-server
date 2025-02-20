import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrderService(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully!",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.getAllOrdersService();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched all orders successfully!",
    data: result,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await OrderServices.getUserOrdersService(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched user orders successfully!",
    data: result,
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await OrderServices.getOrderByIdService(orderId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched order details successfully!",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const result = await OrderServices.updateOrderStatusService(orderId, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully!",
    data: result,
  });
});

// const makePayment = catchAsync(async (req, res) => {
//   const { orderId, paymentDetails } = req.body;
//   const result = await OrderServices.makePaymentService(orderId, paymentDetails);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Payment processed successfully!",
//     data: result,
//   });
// });

export const OrdersController = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  // makePayment,
};
