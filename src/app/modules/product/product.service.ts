import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Product from "../../Schema/Product";
import { calculatePagination } from "../../utils/paginationHelper";
import { productSearchAbleFields } from "./product.constant";
import { TProduct, TReview } from "./product.interface";
import { TStatus } from "../vendor/vendor.interface";

//! Create a new product
const createProductService = async (productData: TProduct) => {
  const { name, vendorId } = productData;

  // Check if product already exists
  const existingProduct = await Product.findOne({ name, vendorId });
  if (existingProduct) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product already exists");
  }

  // Create new product
  const newProduct = await Product.create(productData);

  return newProduct;
};

//! Get all products
const getAllProductsService = async (params: any, options: any) => {
  const { page, limit, skip } = calculatePagination(options);
  const { search, minPrice, maxPrice, ...filterData } = params;

  const query: any = {};

  // Handle search term
  if (search) {
    query.$or = productSearchAbleFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  // Handle price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Handle other filters
  if (Object.keys(filterData).length > 0) {
    Object.keys(filterData).forEach((key) => {
      query[key] = filterData[key];
    });
  }

  // Sorting
  const sortOptions: { [key: string]: 1 | -1 } = {};
  if (options.sortBy && options.sortOrder) {
    sortOptions[options.sortBy] = options.sortOrder === "asc" ? 1 : -1;
  } else {
    sortOptions.createdAt = -1;
  }

  // Execute query
  const result = await Product.find(query).populate("supplier").sort(sortOptions).skip(skip).limit(limit);

  const total = await Product.countDocuments(query);

  return {
    meta: { page, limit, total },
    data: result,
  };
};

//! Get product by ID
const getProductByIdService = async (productId: string) => {
  const product = await Product.findById(productId).populate("supplier");
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  return product;
};

//! Update product
const updateProductService = async (productId: string, updateData: Partial<TProduct>) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
  return updatedProduct;
};

//! Delete product
const deleteProductService = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Delete the product
  await Product.findByIdAndDelete(productId);
  return { message: "Product deleted successfully" };
};

//! Get products by vendor ID
const getProductsByVendorService = async (vendorId: string) => {
  const products = await Product.find({ vendorId });
  if (!products.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No products found for this vendor");
  }
  return products;
};

//! Make Product Review
const makeProductReviewService = async (productId: string, reviewData: TReview) => {
  const updatedProduct = await Product.findByIdAndUpdate(productId, { $push: { reviews: reviewData } }, { new: true });

  if (!updatedProduct) {
    throw new Error("Product not found");
  }

  return updatedProduct;
};

// ! Change product status
const changeProductStatusService = async (productId: string, status: TStatus) => {
  // Validate status
  const validStatuses: TStatus[] = [
    TStatus.ACTIVE,
    TStatus.INACTIVE,
    TStatus.BLOCK,
    TStatus.PENDING,
    TStatus.PROCESSING,
    TStatus.DELETED,
    TStatus.INSTOCK,
    TStatus.OUTOFSTOCK,
    TStatus.DISCONTINUED,
  ];
  if (!validStatuses.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status");
  }
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  // Check if the status is already set
  if (product.status === (status as string)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Product is already ${status}`);
  }
  // Update vendor status
  const updatedVendor = await Product.findByIdAndUpdate(productId, { status: status }, { new: true });

  return updatedVendor;
};

export const ProductsServices = {
  createProductService,
  getAllProductsService,
  updateProductService,
  getProductByIdService,
  deleteProductService,
  getProductsByVendorService,
  makeProductReviewService,
  changeProductStatusService,
};
