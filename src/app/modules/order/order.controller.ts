import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import { orderFilterableFields } from "./order.constant";
import { OrderServices } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrderService(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order placed successfully!",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const filters = pick(req.query, orderFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await OrderServices.getAllOrdersService(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched all orders successfully!",
    data: result,
  });
});

const getVendorOrders = catchAsync(async (req, res) => {
  const filters = pick(req.query, orderFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await OrderServices.getVendorOrdersService(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched vendor orders successfully!",
    data: result,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const id = req.user._id;
  const result = await OrderServices.getUserOrdersService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched user orders successfully!",
    data: result,
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const orderId = req.params.id;
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

export const OrdersController = {
  createOrder,
  getAllOrders,
  getVendorOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
