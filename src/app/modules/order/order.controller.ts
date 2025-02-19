const {
  orderNowService,
  getOrdersService,
  getOrderByIdService,
  getMyOrdersByEmailService,
} = require("./order.service");

exports.orderNow = async (req, res) => {
  try {
    const result = await orderNowService(req.body);

    res.status(200).json({
      status: "success",
      message: "Order successfully Done",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't place the order",
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    let filters = { ...req.query };

    //sort , page , limit -> exclude
    const excludeFields = ["sort", "page", "limit"];
    excludeFields.forEach((field) => delete filters[field]);

    //gt ,lt ,gte .lte
    let filtersString = JSON.stringify(filters);
    filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    filters = JSON.parse(filtersString);

    const queries = {};

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
      console.log(sortBy);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
      console.log(fields);
    }

    if (req.query.page) {
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * parseInt(limit);
      queries.skip = skip;
      queries.limit = parseInt(limit);
    }

    const orders = await getOrdersService(filters, queries);

    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await getOrderByIdService(id);

    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.getMyOrdersByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await getMyOrdersByEmailService(email);

    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the orders",
      error: error.message,
    });
  }
};

export const OrdersController = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  makePayment,
};
