import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BrandServices } from "./brand.service";

const createBrand = catchAsync(async (req, res) => {
  const result = await BrandServices.createBrandService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Brand created successfully!",
    data: result,
  });
});

const getBrands = catchAsync(async (_req, res) => {
  const result = await BrandServices.getBrandsService();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brands retrieved successfully!",
    data: result,
  });
});

const getBrandById = catchAsync(async (req, res) => {
  const brandId = req.params.id;
  const result = await BrandServices.getBrandByIdService(brandId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand retrieved successfully!",
    data: result,
  });
});

const updateBrandById = catchAsync(async (req, res) => {
  const brandId = req.params.id;
  const updateData = req.body;
  const result = await BrandServices.updateBrandService(brandId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand updated successfully!",
    data: result,
  });
});

const deleteBrandById = catchAsync(async (req, res) => {
  const brandId = req.params.id;
  const result = await BrandServices.deleteBrandService(brandId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand deleted successfully!",
    data: result,
  });
});

export const BrandsController = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
};
