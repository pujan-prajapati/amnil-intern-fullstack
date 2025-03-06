import { Between, Not } from "typeorm";
import { Order } from "../entity/order.entity";
import { Product } from "../entity/product.entity";

// get total revenue service
export const getTotalRevenue = async () => {
  const orders = await Order.find();
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  return totalRevenue;
};

// get total orders serivce
export const getTotalOrders = async () => {
  const orders = await Order.count();
  return orders;
};

// get daily report service
export const getDailyReport = async (from?: string, to?: string) => {
  const where =
    from && to ? { createdAt: Between(new Date(from), new Date(to)) } : {};

  const orders = await Order.find({ where });

  const dailyReport = orders.reduce((report, order) => {
    const date = order.createdAt.toISOString().split("T")[0];
    if (!report[date]) {
      report[date] = { date, totalRevenue: 0, orderCount: 0 };
    }
    report[date].totalRevenue += order.totalPrice;
    report[date].orderCount++;
    return report;
  }, {} as Record<string, { date: string; totalRevenue: number; orderCount: number }>);

  return Object.values(dailyReport).sort((a, b) => (a.date > b.date ? -1 : 1));
};

// get top 10 selling products service
export const getTopSellingProducts = async () => {
  const orders = await Order.find({
    relations: ["items", "items.product"],
  });

  const productSales = new Map<
    string,
    { product: Product; orderCount: number; totalRevenue: number }
  >();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSales.has(item.product.id)) {
        productSales.set(item.product.id, {
          product: item.product,
          orderCount: 0,
          totalRevenue: 0,
        });
      }

      const productData = productSales.get(item.product.id)!;
      productData.orderCount++;
      productData.totalRevenue += item.product.price;
    });
  });

  const sortedProducts = Array.from(productSales.values()).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  return sortedProducts.slice(0, 10); // Top 10 Products
};

// get top 10 searched products service
export const getTopSearchedProducts = async () => {
  const products = await Product.find({
    select: ["id", "name", "views"],
    where: { views: Not(0) },
    order: { views: "DESC" },
    take: 10,
  });

  return products;
};

// get monthly sales service
export const getMonthlySales = async (from?: string, to?: string) => {
  const where =
    from && to ? { createdAt: Between(new Date(from), new Date(to)) } : {};

  const orders = await Order.find({ where });

  const monthlySales = orders.reduce((acc, order) => {
    const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM

    if (!acc[month]) {
      acc[month] = order.totalPrice;
    } else {
      acc[month] += order.totalPrice;
    }

    return acc;
  }, {} as Record<string, number>);

  return Object.keys(monthlySales).map((month) => ({
    month,
    totalPrice: monthlySales[month],
    count: orders.filter(
      (order) => order.createdAt.toISOString().slice(0, 7) === month
    ).length,
  }));
};

// year-over-year growth service
export const getYoYGrowth = async (year: number) => {
  const currentYearOrders = await Order.find({
    where: {
      createdAt: Between(new Date(`${year}-01-01`), new Date(`${year}-12-31`)),
    },
  });
  const previousYearOrders = await Order.find({
    where: {
      createdAt: Between(
        new Date(`${year - 1}-01-01`),
        new Date(`${year - 1}-12-31`)
      ),
    },
  });

  const currentYearRevenue = currentYearOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );
  const previousYearRevenue = previousYearOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  const growthPrecentage = previousYearRevenue
    ? ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100
    : 0;

  return {
    currentYearRevenue,
    previousYearRevenue,
    growthPrecentage,
  };
};

// month-over-month growth service
export const getMoMGrowth = async (year: number, month: number) => {
  const currentMonthStart = new Date(year, month - 1, 1);
  const currentMonthEnd = new Date(year, month, 0);

  const previousMonthStart = new Date(year, month - 2, 1);
  const previousMonthEnd = new Date(year, month - 1, 0);

  const currentMonthOrders = await Order.find({
    where: {
      createdAt: Between(currentMonthStart, currentMonthEnd),
    },
  });

  const previousMonthOrders = await Order.find({
    where: {
      createdAt: Between(previousMonthStart, previousMonthEnd),
    },
  });

  const currentMonthRevenue = currentMonthOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );
  const previousMonthRevenue = previousMonthOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  const growthPrecentage = previousMonthRevenue
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
      100
    : 0;

  return {
    currentMonthRevenue,
    previousMonthRevenue,
    growthPrecentage,
  };
};

// profitability analysis service
export const getProfitability = async () => {
  const orders = await Order.find({
    relations: ["items", "items.product"],
  });

  const productProfit = new Map<
    string,
    { product: Product; totalRevenue: number; orderCount: number }
  >();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productProfit.has(item.product.id)) {
        productProfit.set(item.product.id, {
          product: item.product,
          totalRevenue: 0,
          orderCount: 0,
        });
      }

      const productData = productProfit.get(item.product.id)!;
      productData.totalRevenue += item.product.price;
      productData.orderCount++;
    });
  });

  const profitability = Array.from(productProfit.values()).map(
    ({ product, totalRevenue, orderCount }) => {
      return {
        product: product.name,
        totalRevenue,
        orderCount,
        profitMargin:
          totalRevenue && orderCount ? totalRevenue / orderCount : 0,
      };
    }
  );

  return profitability.sort((a, b) => b.profitMargin - a.profitMargin);
};
