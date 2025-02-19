const Order = require("../models/Order");
const User = require("../models/User");

exports.orderNowService = async (data) => {
  const order = await Order.create(data);

  const { _id: orderId, user } = order;

  //update user orders
  await User.findByIdAndUpdate(
    { _id: user.id },
    { $push: { myOrders: orderId } },
    { useFindAndModify: false }
  );

  return order;
};

exports.getOrdersService = async (filters, queries) => {
  const orders = await Order.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy);
  // .populate("brands")

  const total = await Order.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, orders };
};

exports.getOrderByIdService = async (id) => {
  const order = await Order.findById({ _id: id });

  return order;
};

exports.findOrderByUserEmailService = async (email) => {
  const order = await Order.findOne({ "user.email": email });

  return order;
};

exports.getMyOrdersByEmailService = async (email) => {
  const order = await Order.find({ "user.email": email });

  return order;
};
