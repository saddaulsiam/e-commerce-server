import httpStatus from "http-status";
import Order from "../../Schema/Order";
import SubOrder from "../../Schema/SubOrder";
import ApiError from "../../errors/ApiError";
import { TOrder } from "../../interface/order";

export const createOrderService = async (orderData: TOrder) => {
  const { subOrders, ...orderDetails } = orderData;

  // Validate if subOrders exists and has valid data
  if (!subOrders || subOrders.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order must have at least one sub-order");
  }

  // Create the main order first
  const order = await Order.create(orderDetails);

  // Now, create sub-orders and associate them with the main order
  const createdSubOrders = [];
  for (const subOrderData of subOrders) {
    // Attach the parent order ID to the sub-order
    subOrderData.orderId = order._id;

    // Create the sub-order
    const subOrder = await SubOrder.create(subOrderData);

    createdSubOrders.push(subOrder);
  }

  // Return the main order along with the created sub-orders
  return {
    order,
    subOrders: createdSubOrders,
  };
};

export const getAllOrdersService = async () => {
  const orders = await Order.find().populate("subOrders");
  return orders;
};

export const getUserOrdersService = async (userId: string) => {
  const orders = await Order.find({ userId }).populate("subOrders");
  if (!orders) {
    throw new ApiError(httpStatus.NOT_FOUND, "No orders found for this user");
  }
  return orders;
};

export const getOrderByIdService = async (orderId: string) => {
  const order = await Order.findById(orderId).populate("subOrders");
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  return order;
};

export const updateOrderStatusService = async (orderId: string, status: string) => {
  const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

  if (!updatedOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  return updatedOrder;
};

// export const makePaymentService = async (orderId, paymentDetails) => {
//   const order = await Order.findById(orderId);

//   if (!order) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
//   }

//   // Update payment status and details
//   order.paymentDetails = paymentDetails;
//   order.paymentStatus = "paid";
//   order.isPaid = true;

//   const updatedOrder = await order.save();

//   return updatedOrder;
// };

export const OrderServices = {
  createOrderService,
  getAllOrdersService,
  getUserOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  // makePaymentService,
};
