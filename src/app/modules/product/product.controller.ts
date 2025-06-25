import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import { productFilterableFields } from "./product.constant";
import { ProductsServices } from "./product.service";

//! Create a new product
const createProduct = catchAsync(async (req, res) => {
  const result = await ProductsServices.createProductService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

//! Get all products
const getAllProducts = catchAsync(async (req, res) => {
  const filters = pick(req.query, productFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ProductsServices.getAllProductsService(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully!",
    data: result,
  });
});

//! Get product by ID
const getProductById = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const result = await ProductsServices.getProductByIdService(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully!",
    data: result,
  });
});

//! Update product
const updateProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;
  const result = await ProductsServices.updateProductService(productId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully!",
    data: result,
  });
});

//! Delete product
const deleteProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const result = await ProductsServices.deleteProductService(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully!",
    data: result,
  });
});

//! Get products by vendor ID
const getProductsByVendor = catchAsync(async (req, res) => {
  const vendorId = req.params.vendorId;
  const result = await ProductsServices.getProductsByVendorService(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products by vendor retrieved successfully!",
    data: result,
  });
});

//! make Product Review
const makeProductReview = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const result = await ProductsServices.makeProductReviewService(productId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review successfully submit",
    data: result,
  });
});

//! Change vendor status
const changeProductStatus = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const status = req.body.status;

  const result = await ProductsServices.changeProductStatusService(productId, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product status updated successfully!",
    data: result,
  });
});

export const ProductsController = {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductById,
  deleteProduct,
  getProductsByVendor,
  makeProductReview,
  changeProductStatus,
};
