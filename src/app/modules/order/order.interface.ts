import { Document, Types } from "mongoose";
import { TAddress } from "../user/user.interface";

// Payment Status Enum
export enum PaymentStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  REFUNDED = "refunded",
}

// Order Status Enum
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

// Payment Methods Enum
export enum PaymentMethod {
  CASH_ON_DELIVERY = "cashOnDelivery",
  SSLCOMMERZ = "sslCommerz",
  STRIPE = "stripe",
}

// Sub-Order Interface
export interface TSubOrder extends Document {
  name: string;
  image: string;
  productId: string;
  vendorId: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

// Main Order Interface
export interface TOrder extends Document {
  userId: Types.ObjectId;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  paymentStatus: PaymentStatus;
  shippingAddress: TAddress;
  status: OrderStatus;
  subOrders: TSubOrder[];
}
