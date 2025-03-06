import { Router } from "express";
import * as reportControllers from "../controllers/report.controllers";
const router = Router();

router.route("/totalRevenue").get(reportControllers.getTotalRevenue);
router.route("/totalOrders").get(reportControllers.getTotalOrders);
router.route("/dailyReport").get(reportControllers.getDailyReport);
router.route("/monthlySales").get(reportControllers.getMonthlySales);
router
  .route("/topSearchedProducts")
  .get(reportControllers.getTopSearchedProducts);
router
  .route("/topSellingProducts")
  .get(reportControllers.getTopSellingProducts);

router.route("/export/csv").get(reportControllers.exportReportToCSV);
router.route("/export/excel").get(reportControllers.exportReportToExcel);
router.route("/export/pdf").get(reportControllers.exportReportToPDF);

router.get("/yoy/:year", reportControllers.getYoYGrowthController);
router.get("/mom/:year/:month", reportControllers.getMoMGrowthController);
router.get("/profitability", reportControllers.getProfitabilityController);

export { router as reportRouter };
