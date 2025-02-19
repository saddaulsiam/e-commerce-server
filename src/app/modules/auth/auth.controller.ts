import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const register = catchAsync(async (req, res) => {
  const result = await AuthServices.RegisterService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Register in successfully!",
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const result = await AuthServices.findUserAndUpdateProfile(req.params.email, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully update the profile",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  ``;
  const result = await AuthServices.getMe(req.params.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully get my profile",
    data: result,
  });
});

// const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     let filters = { ...req.query };

//     //sort , page , limit -> exclude
//     const excludeFields = ["sort", "page", "limit"];
//     excludeFields.forEach((field) => delete filters[field]);

//     const queries = {};

//     if (req.query.page) {
//       const { page = 1, limit = 10 } = req.query;

//       const skip = (page - 1) * parseInt(limit);
//       queries.skip = skip;
//       queries.limit = parseInt(limit);
//     }

//     const users = await findAllUsers(filters, queries);

//     res.status(200).json({
//       status: "success",
//       data: users,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: "fail",
//       error,
//     });
//   }
// };

// const addAddress = async (req: Request, res: Response) => {
//   try {
//     const user = await addAddressService(req.params.id, req.body);
//     res.status(200).json({
//       status: "success",
//       message: "Successfully added address",
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "fail",
//       error,
//     });
//   }
// };

// const removeAddress = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.id;
//     const addressId = req.body.addressId;

//     const user = await removeAddressService(userId, addressId);

//     res.status(200).json({
//       status: "success",
//       message: "Successfully remove address",
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "fail",
//       error,
//     });
//   }
// };

export const UserController = {
  register,
  update,
  getMe,
  // getAllUsers,
  // addAddress,
  // removeAddress,
};
