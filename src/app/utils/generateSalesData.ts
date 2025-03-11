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

interface DailySalesData {
  hour: string;
  sales: number;
  orders: number;
}

interface MonthlyDaysSalesData {
  day: number;
  sales: number;
  orders: number;
}

interface UniqueCustomerGrowth {
  month: string;
  customers: number;
}

export const generateSalesData = (orders: Order[]) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM"];

  // Initialize data structures
  const monthlySales: SalesData[] = months.map((month) => ({ month, sales: 0, orders: 0 }));
  const weeklySales: WeeklySalesData[] = daysOfWeek.map((day) => ({ day, sales: 0, orders: 0 }));
  const dailySales: DailySalesData[] = timeSlots.map((hour) => ({ hour, sales: 0, orders: 0 }));

  // Unique customers per month
  const uniqueCustomersPerMonth: { [key: string]: Set<string> } = Object.fromEntries(
    months.map((month) => [month, new Set<string>()])
  );

  // Get current month for monthly days sales
  const currentMonth = moment().format("MMM");
  const monthlyDaysSales: MonthlyDaysSalesData[] = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    sales: 0,
    orders: 0,
  }));

  orders.forEach((order) => {
    const orderDate = moment(order.createdAt);
    const month = orderDate.format("MMM");
    const dayIndex = orderDate.isoWeekday() - 1; // Monday = 0, Sunday = 6
    const hour = orderDate.hour();
    const dayOfMonth = orderDate.date(); // Get the day of the month (1-31)

    // Convert userId (Mongoose ObjectId) to string
    const normalizedUserId = order.userId instanceof Types.ObjectId ? order.userId.toString() : String(order.userId);

    // Monthly sales and unique customers
    const monthIndex = months.indexOf(month);
    if (monthIndex !== -1) {
      monthlySales[monthIndex].sales += order.totalAmount;
      monthlySales[monthIndex].orders += 1;
      uniqueCustomersPerMonth[month].add(normalizedUserId);
    }

    // Weekly sales
    weeklySales[dayIndex].sales += order.totalAmount;
    weeklySales[dayIndex].orders += 1;

    // Daily sales by time slots
    if (hour < 4) dailySales[0].sales += order.totalAmount;
    else if (hour < 8) dailySales[1].sales += order.totalAmount;
    else if (hour < 12) dailySales[2].sales += order.totalAmount;
    else if (hour < 16) dailySales[3].sales += order.totalAmount;
    else if (hour < 20) dailySales[4].sales += order.totalAmount;
    else dailySales[5].sales += order.totalAmount;

    // Track orders in time slots
    dailySales.forEach((slot, index) => {
      if (
        (index === 0 && hour < 4) ||
        (index === 1 && hour >= 4 && hour < 8) ||
        (index === 2 && hour >= 8 && hour < 12) ||
        (index === 3 && hour >= 12 && hour < 16) ||
        (index === 4 && hour >= 16 && hour < 20) ||
        (index === 5 && hour >= 20)
      ) {
        slot.orders += 1;
      }
    });

    // Track daily sales for the current month (limit to 30 days)
    if (month === currentMonth && dayOfMonth <= 30) {
      monthlyDaysSales[dayOfMonth - 1].sales += order.totalAmount;
      monthlyDaysSales[dayOfMonth - 1].orders += 1;
    }
  });

  // Calculate unique customer growth
  const uniqueCustomerGrowth: UniqueCustomerGrowth[] = months.map((month) => ({
    month,
    customers: uniqueCustomersPerMonth[month].size,
  }));

  return {
    monthly: monthlySales,
    weekly: weeklySales,
    daily: dailySales,
    uniqueCustomerGrowth,
    currentMonth,
    monthlyDaysSales,
  };
};
