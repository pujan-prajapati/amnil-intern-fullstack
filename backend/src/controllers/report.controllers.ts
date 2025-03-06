import { Request, Response } from "express";
import * as reportServices from "../services/report.serivces";
import * as csv from "fast-csv";
import * as ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import * as asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse";
import { Order } from "../entity/order.entity";

// get total revenue
export const getTotalRevenue = asyncHandler(
  async (req: Request, res: Response) => {
    const totalRevenue = await reportServices.getTotalRevenue();
    res
      .status(200)
      .json(new ApiResponse(200, totalRevenue, "Total sales fetched"));
  }
);

// get total orders
export const getTotalOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const totalOrders = await reportServices.getTotalOrders();
    res
      .status(200)
      .json(new ApiResponse(200, totalOrders, "Total orders fetched"));
  }
);

// get daily report
export const getDailyReport = asyncHandler(
  async (req: Request, res: Response) => {
    const { from, to } = req.query;
    const report = await reportServices.getDailyReport(
      from as string,
      to as string
    );
    res.status(200).json(new ApiResponse(200, report, "Daily report fetched"));
  }
);

// top 10 selling products
export const getTopSellingProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await reportServices.getTopSellingProducts();
    res
      .status(200)
      .json(new ApiResponse(200, report, "Top selling products fetched"));
  }
);

// top 10 searched products
export const getTopSearchedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await reportServices.getTopSearchedProducts();
    res
      .status(200)
      .json(new ApiResponse(200, report, "Top searched products fetched"));
  }
);

// monthly sales
export const getMonthlySales = asyncHandler(
  async (req: Request, res: Response) => {
    const { from, to } = req.query;
    const report = await reportServices.getMonthlySales(
      from as string,
      to as string
    );
    res.status(200).json(new ApiResponse(200, report, "Monthly sales fetched"));
  }
);

export const getYoYGrowthController = async (req: Request, res: Response) => {
  const { year } = req.params;
  try {
    const data = await reportServices.getYoYGrowth(parseInt(year));
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch Year-over-Year growth", error });
  }
};

// Month-over-Month Growth Controller
export const getMoMGrowthController = async (req: Request, res: Response) => {
  const { year, month } = req.params;
  try {
    const data = await reportServices.getMoMGrowth(
      parseInt(year),
      parseInt(month)
    );
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch Month-over-Month growth", error });
  }
};

// Profitability Analysis Controller
export const getProfitabilityController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await reportServices.getProfitability();
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch Profitability Analysis", error });
  }
};

export const exportReportToCSV = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await Order.find();
    const csvStream = csv.format({ headers: true });

    res.setHeader("Content-Disposition", "attachment; filename=report.csv");
    res.setHeader("Content-Type", "text/csv");

    csvStream.pipe(res);
    orders.forEach((order) => {
      csvStream.write({
        OrderID: order.id,
        TotalPrice: order.totalPrice,
        CreatedAt: order.createdAt.toISOString(),
      });
    });

    csvStream.end();
  }
);

// Export Report to Excel
export const exportReportToExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await Order.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.columns = [
      { header: "Order ID", key: "id", width: 15 },
      { header: "Total Price", key: "totalPrice", width: 20 },
      { header: "Created At", key: "createdAt", width: 30 },
    ];

    orders.forEach((order) => {
      worksheet.addRow({
        id: order.id,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt.toISOString(),
      });
    });

    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  }
);

// Export Report to PDF
export const exportReportToPDF = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await Order.find();
    const pdf = new jsPDF();
    pdf.text("Order Report", 10, 10);

    let y = 20;
    orders.forEach((order) => {
      pdf.text(
        `OrderID: ${order.id} | TotalPrice: ${
          order.totalPrice
        } | CreatedAt: ${order.createdAt.toISOString()}`,
        10,
        y
      );
      y += 10;
    });

    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    res.setHeader("Content-Type", "application/pdf");

    const pdfBuffer = pdf.output("arraybuffer");
    res.end(Buffer.from(pdfBuffer));
  }
);
