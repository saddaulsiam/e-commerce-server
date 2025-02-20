import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Product from "../../Schema/Product";
import { TProduct } from "../../interface/product";

//! Create a new product
export const createProductService = async (productData: TProduct) => {
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
export const getAllProductsService = async () => {
  const products = await Product.find();
  return products;
};

//! Get product by ID
export const getProductByIdService = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  return product;
};

//! Update product
export const updateProductService = async (productId: string, updateData: Partial<TProduct>) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
  return updatedProduct;
};

//! Delete product
export const deleteProductService = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Delete the product
  await Product.findByIdAndDelete(productId);
  return { message: "Product deleted successfully" };
};

//! Get products by vendor ID
export const getProductsByVendorService = async (vendorId: string) => {
  const products = await Product.find({ vendorId });
  if (!products.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No products found for this vendor");
  }
  return products;
};

export const ProductsServices = {
  createProductService,
  getAllProductsService,
  updateProductService,
  getProductByIdService,
  deleteProductService,
  getProductsByVendorService,
};
