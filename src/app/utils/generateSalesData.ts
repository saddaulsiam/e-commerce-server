import moment from "moment";
import { Types } from "mongoose";

interface Order {
  userId: Types.ObjectId | string;
  totalAmount: number;
  createdAt: Date;
}

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

interface WeeklySalesData {
  day: string;
  sales: number;
  orders: number;
}

interface HourlySalesData {
  hour: string;
  sales: number;
  orders: number;
}

interface MonthlyDaysSalesData {
  day: number;
  sales: number;
  orders: number;
}

export const generateSalesData = (orders: Order[]) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM"];

  // Initialize data structures
  const monthlySales: SalesData[] = months.map((month) => ({ month, sales: 0, orders: 0 }));
  const weeklySales: WeeklySalesData[] = daysOfWeek.map((day) => ({ day, sales: 0, orders: 0 }));
  const hourlySales: HourlySalesData[] = timeSlots.map((hour) => ({ hour, sales: 0, orders: 0 }));

  // Get current month for daily sales tracking
  const currentMonth = moment().format("MMM");
  const dailySales: MonthlyDaysSalesData[] = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    sales: 0,
    orders: 0,
  }));

  orders.forEach((order) => {
    const orderDate = moment(order.createdAt);
    const month = orderDate.format("MMM");
    const dayIndex = orderDate.isoWeekday() - 1; // Monday = 0, Sunday = 6
    const hour = orderDate.hour();
    const dayOfMonth = orderDate.date();

    const userId = order.userId instanceof Types.ObjectId ? order.userId.toString() : String(order.userId);

    // Monthly sales
    const monthIndex = months.indexOf(month);
    if (monthIndex !== -1) {
      monthlySales[monthIndex].sales += order.totalAmount;
      monthlySales[monthIndex].orders += 1;
    }

    // Weekly sales
    weeklySales[dayIndex].sales += order.totalAmount;
    weeklySales[dayIndex].orders += 1;

    // Hourly sales by time slot
    const timeSlotIndex = hour < 4 ? 0 : hour < 8 ? 1 : hour < 12 ? 2 : hour < 16 ? 3 : hour < 20 ? 4 : 5;

    hourlySales[timeSlotIndex].sales += order.totalAmount;
    hourlySales[timeSlotIndex].orders += 1;

    // Daily sales for current month (limit to 30 days)
    if (month === currentMonth && dayOfMonth <= 30) {
      dailySales[dayOfMonth - 1].sales += order.totalAmount;
      dailySales[dayOfMonth - 1].orders += 1;
    }
  });

  return {
    currentMonth,
    hourly: hourlySales,
    daily: dailySales,
    weekly: weeklySales,
    monthly: monthlySales,
  };
};
