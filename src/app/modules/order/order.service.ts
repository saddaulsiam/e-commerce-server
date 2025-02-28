import httpStatus from "http-status";
import mongoose from "mongoose";
import Order from "../../Schema/Order";
import SubOrder from "../../Schema/SubOrder";
import AppError from "../../errors/AppError";
import { TOrder } from "./order.interface";

//! Create Order Service
const createOrderService = async (orderData: TOrder) => {
  if (!orderData?.subOrders || orderData.subOrders.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order must have at least one sub-order");
  }

  // Start a Mongoose transaction to ensure consistency
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the main order
    const { subOrders, ...orderDetails } = orderData;
    const [order] = await Order.create([{ ...orderDetails }], { session });

    if (!order) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create the main order");
    }

    // Prepare sub-orders for bulk insert
    const subOrdersToInsert = subOrders.map((subOrderData) => ({
      orderId: order._id,
      vendorId: subOrderData.vendorId,
      item: {
        name: subOrderData.name,
        productId: subOrderData.productId,
        quantity: subOrderData.quantity,
        price: subOrderData.price,
      },
      totalAmount: subOrderData.price * subOrderData.quantity,
      paymentMethod: order.paymentMethod,
      isPaid: order.isPaid,
      shippingAddress: order.shippingAddress,
      status: order.status,
    }));

    // Bulk insert sub-orders
    const createdSubOrders = await SubOrder.insertMany(subOrdersToInsert, { session });

    // Attach sub-order IDs to the main order
    order.subOrders = createdSubOrders.map((sub) => sub._id);
    await order.save({ session });

    // Commit transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    return {
      order,
      subOrders: createdSubOrders,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Order creation failed. Please try again.");
  }
};

export const getAllOrdersService = async () => {
  const orders = await Order.find().populate("subOrders");
  return orders;
};

export const getUserOrdersService = async (userId: string) => {
  const orders = await Order.find({ userId }).populate("subOrders");
  if (!orders) {
    throw new AppError(httpStatus.NOT_FOUND, "No orders found for this user");
  }
  return orders;
};

export const getOrderByIdService = async (orderId: string) => {
  const order = await Order.findById(orderId).populate("subOrders");
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return order;
};

export const updateOrderStatusService = async (orderId: string, status: string) => {
  const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

  if (!updatedOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return updatedOrder;
};

export const OrderServices = {
  createOrderService,
  getAllOrdersService,
  getUserOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
};
