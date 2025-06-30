import httpStatus from "http-status";
import mongoose from "mongoose";
import Order from "../../Schema/Order";
import SubOrder from "../../Schema/SubOrder";
import AppError from "../../errors/AppError";
import { calculatePagination } from "../../utils/paginationHelper";
import { orderFilterableFields, orderSearchAbleFields } from "./order.constant";
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
      userId: order.userId,
      item: {
        name: subOrderData.name,
        image: subOrderData.image,
        productId: subOrderData.productId,
        quantity: subOrderData.quantity,
        price: subOrderData.price,
        color: subOrderData.color,
        size: subOrderData.size,
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

//! Get All Orders
const getAllOrdersService = async (params: any, options: any) => {
  const { limit, skip } = calculatePagination(options);
  const { search, ...filterData } = params;

  const query: any = {};

  if (search) {
    // If the search string is a valid ObjectId, perform an exact match on _id
    if (mongoose.Types.ObjectId.isValid(search)) {
      query._id = search;
    } else {
      // Otherwise, use a regex search on the specified fields
      query.$or = orderSearchAbleFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }
  }

  if (Object.keys(filterData).length > 0) {
    Object.keys(filterData).forEach((key) => {
      query[key] = filterData[key];
    });
  }

  const sortOptions: { [key: string]: 1 | -1 } = {};

  if (options.sortBy && options.sortOrder) {
    sortOptions[options.sortBy as string] = options.sortOrder === "asc" ? 1 : -1;
  } else {
    sortOptions.createdAt = -1;
  }

  const result = await Order.find(query).sort(sortOptions).skip(skip).limit(limit).populate("subOrders");

  const total = await Order.countDocuments(query);

  return {
    meta: {
      page: Math.ceil(total / limit),
      limit,
      total,
    },
    data: result,
  };
};

//! Get All Orders
const getVendorOrdersService = async (params: any, options: any) => {
  const { page, limit, skip } = calculatePagination(options);
  const { date, searchTerm, ...filterData } = params;

  const query: any = {};

  if (searchTerm) {
    query.$or = orderFilterableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    }));
  }

  if (Object.keys(filterData).length > 0) {
    Object.keys(filterData).forEach((key) => {
      query[key] = filterData[key];
    });
  }

  const sortOptions: { [key: string]: 1 | -1 } = {};

  if (options.sortBy && options.sortOrder) {
    sortOptions[options.sortBy as string] = options.sortOrder === "asc" ? 1 : -1;
  } else {
    sortOptions.createdAt = -1;
  }

  const result = await SubOrder.find(query)
    .populate("orderId")
    .populate("item.productId")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await SubOrder.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

//! Get User Orders Service
const getUserOrdersService = async (userId: string) => {
  const orders = await Order.find({ userId }).populate("subOrders");
  if (!orders) {
    throw new AppError(httpStatus.NOT_FOUND, "No orders found for this user");
  }
  return orders;
};

//! Get Order By Id Service
const getOrderByIdService = async (orderId: string) => {
  const order = await Order.findById(orderId).populate({
    path: "subOrders",
    populate: {
      path: "item.productId",
      model: "Product",
    },
  });
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return order;
};

//! Get Sub Order By Id Service
const getSuborderByIdService = async (orderId: string) => {
  const order = await SubOrder.findById(orderId).populate("userId");
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return order;
};

//! Update Order Status Service
const updateOrderStatusService = async (orderId: string, status: string) => {
  const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

  if (!updatedOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return updatedOrder;
};

//! Update Order Status Service
const updateSubOrderStatusService = async (orderId: string, status: string) => {
  const updatedOrder = await SubOrder.findByIdAndUpdate(orderId, { status }, { new: true });

  console.log(updatedOrder);
  if (!updatedOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return updatedOrder;
};

export const OrderServices = {
  createOrderService,
  getAllOrdersService,
  getVendorOrdersService,
  getUserOrdersService,
  getOrderByIdService,
  getSuborderByIdService,
  updateOrderStatusService,
  updateSubOrderStatusService,
};
