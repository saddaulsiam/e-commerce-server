import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const register = catchAsync(async (req, res) => {
  const result = await AuthServices.registerService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Register is successfully!",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await AuthServices.loginService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login Successfully",
    data: result,
  });
});

export const UserController = {
  register,
  login,
};
