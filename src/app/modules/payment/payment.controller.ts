const ObjectID = require("mongodb").ObjectID;
const { orderNowService } = require("../services/order.service");
const {
  createPaymentIntentService,
  createSslcommerzPaymentIntentService,
  sslPaymentSuccessService,
  sslPaymentFileOrCancelService,
} = require("./payment.service");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    const totalPrice = parseFloat(price.toFixed(2));

    const clientSecret = await createPaymentIntentService(totalPrice);

    res.status(200).json({
      status: "success",
      message: "Successfully generate client secret",
      clientSecret,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: "Couldn't generate client secret ",
    });
  }
};

exports.createSslcommerzPaymentIntent = async (req, res) => {
  try {
    const tran_id = new ObjectID().toString();
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
    await orderNowService(order);

    const intent = await createSslcommerzPaymentIntentService(data);

    res.status(200).json({
      status: "success",
      message: "Successfully generate gateway page URL",
      gatewayPageURL: intent,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error: "Couldn't generate gateway page URL",
    });
  }
};

exports.sslPaymentSuccess = async (req, res) => {
  await sslPaymentSuccessService(req.params.tran_id);

  res.redirect("http://localhost:3000/payment/success");
};

exports.sslPaymentFail = async (req, res) => {
  await sslPaymentFileOrCancelService(req.params.tran_id);

  res.redirect("http://localhost:3000/payment/fail");
};

exports.sslPaymentCancel = async (req, res) => {
  await sslPaymentFileOrCancelService(req.params.tran_id);

  res.redirect("http://localhost:3000/payment");
};
