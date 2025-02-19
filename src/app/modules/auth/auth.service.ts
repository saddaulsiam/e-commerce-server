import { Request } from "express";
import User from "../../Schema/User";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const RegisterService = async (data: any) => {
  const userData = {
    email: data.email,
    displayName: data.displayName,
    emailVerified: data.emailVerified,
  };

  return await User.create(userData);
};

const findUserAndUpdateProfile = async (email: string, data: any) => {
  const result = await User.findOneAndUpdate(
    { email },
    {
      $set: data,
    },
    { new: true }
  )
    .select({ password: 0 })
    .populate("myOrders");
  return result;
};

const getMe = async (email: string) => {
  return await User.findOne({ email });
};

/* 
const findAllUsers = async (filters, queries) => {
  const users = await User.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy);

  const total = await User.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, users };
};

const findUserByToken = async (token) => {
  return await User.findOne({ confirmationToken: token }).select({
    password: 0,
  });
};

const addAddressService = async (id, data) => {
  const order = await User.findByIdAndUpdate(
    { _id: id },
    {
      $push: { shippingAddress: data },
    },
    { new: true }
  );

  return order;
};

const removeAddressService = async (userId, addressId) => {
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    {
      $pull: {
        shippingAddress: { _id: addressId },
      },
    },
    { new: true }
  );

  return user;
}; */

export const AuthServices = {
  RegisterService,
  findUserAndUpdateProfile,
  getMe,
};
