import { Types } from "mongoose";

export interface TSubOrder {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  vendorId: Types.ObjectId;
  orderId: Types.ObjectId;
  status: "pending" | "completed" | "cancelled";
}

export interface TOrder extends Document {
  userId: Types.ObjectId;
  totalAmount: number;
  paymentMethod: "online" | "cod";
  status: "pending" | "completed" | "cancelled";
  subOrders: TSubOrder[];
  createdAt: Date;
  updatedAt: Date;
}
