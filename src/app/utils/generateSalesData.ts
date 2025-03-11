import moment from "moment";
import { Types } from "mongoose";

export const generateSalesData = (orders: any) => {
  // Aggregate monthly sales
  const monthlySales = [
    { month: "Jan", sales: 0, orders: 0 },
    { month: "Feb", sales: 0, orders: 0 },
    { month: "Mar", sales: 0, orders: 0 },
    { month: "Apr", sales: 0, orders: 0 },
    { month: "May", sales: 0, orders: 0 },
    { month: "Jun", sales: 0, orders: 0 },
  ];

  // Aggregate weekly sales
  const weeklySales = [
    { day: "Mon", sales: 0, orders: 0 },
    { day: "Tue", sales: 0, orders: 0 },
    { day: "Wed", sales: 0, orders: 0 },
    { day: "Thu", sales: 0, orders: 0 },
    { day: "Fri", sales: 0, orders: 0 },
    { day: "Sat", sales: 0, orders: 0 },
    { day: "Sun", sales: 0, orders: 0 },
  ];

  // Aggregate daily sales (by time)
  const dailySales = [
    { hour: "12 AM", sales: 0, orders: 0 },
    { hour: "4 AM", sales: 0, orders: 0 },
    { hour: "8 AM", sales: 0, orders: 0 },
    { hour: "12 PM", sales: 0, orders: 0 },
    { hour: "4 PM", sales: 0, orders: 0 },
    { hour: "8 PM", sales: 0, orders: 0 },
  ];

  // Track unique customers per month for growth calculation using `userId`
  const uniqueCustomersPerMonth: { [key: string]: Set<string> } = {
    Jan: new Set(),
    Feb: new Set(),
    Mar: new Set(),
    Apr: new Set(),
    May: new Set(),
    Jun: new Set(),
    Jul: new Set(),
    Aug: new Set(),
    Sep: new Set(),
    Oct: new Set(),
    Nov: new Set(),
    Dec: new Set(),
  };

  orders.forEach((order: any) => {
    const orderDate = moment(order.createdAt);
    const month = orderDate.format("MMM");
    const dayIndex = orderDate.isoWeekday() - 1;
    const hour = orderDate.hour();

    // Convert userId (Mongoose ObjectId) to string
    const normalizedUserId = order.userId instanceof Types.ObjectId ? order.userId.toString() : order.userId;

    // Monthly sales and unique customers
    const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].indexOf(month);
    if (monthIndex !== -1 && normalizedUserId) {
      monthlySales[monthIndex].sales += order.totalAmount;
      monthlySales[monthIndex].orders += 1;

      // Add the normalized userId to the Set for that month (only once per user)
      uniqueCustomersPerMonth[month].add(normalizedUserId);
    }

    // Weekly sales
    weeklySales[dayIndex].sales += order.totalAmount;
    weeklySales[dayIndex].orders += 1;

    // Daily sales (by time)
    if (hour < 4) dailySales[0].sales += order.totalAmount;
    else if (hour < 8) dailySales[1].sales += order.totalAmount;
    else if (hour < 12) dailySales[2].sales += order.totalAmount;
    else if (hour < 16) dailySales[3].sales += order.totalAmount;
    else if (hour < 20) dailySales[4].sales += order.totalAmount;
    else dailySales[5].sales += order.totalAmount;

    // Track orders in daily slots
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
  });

  // Calculate unique customer growth for each month
  const uniqueCustomerGrowth = Object.keys(uniqueCustomersPerMonth).map((month) => ({
    month,
    customers: uniqueCustomersPerMonth[month].size,
  }));

  return {
    monthly: monthlySales,
    weekly: weeklySales,
    daily: dailySales,
    uniqueCustomerGrowth,
  };
};
