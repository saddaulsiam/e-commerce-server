import { Document, Types } from "mongoose";

export interface TUser extends Document {
  displayName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: "customer" | "vendor";
  isEmailVerified: boolean;
  profile: TProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface TAddress {
  region: string;
  city: string;
  area: string;
  fullAddress: string;
}

export interface TProfile extends Document {
  userId: Types.ObjectId;
  address: TAddress[];
  photo: string;
  orders: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
