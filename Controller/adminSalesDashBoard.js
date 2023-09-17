const express = require("express");
const Router = express.Router();
const salesReportHelper = require("../Helpers/Admin_Helpers/salesReportHelper");
const isAdmin = require("../Middleware/adminAuth");

// Fetch orders from the database
Router.get("/Report", isAdmin, salesReportHelper.getSalesReportData);
Router.get(
  "/Report/lineGraph",
  isAdmin,
  salesReportHelper.getSalesReportForLineGraph
);
Router.get("/productSalesReport", isAdmin, salesReportHelper.getSalesReport);

// Route for getting sales report for a specific day
Router.get(
  "/salesReport/day/:date",
  isAdmin,
  salesReportHelper.getSalesReportForDay
);
// Route for getting sales report for a specific week
Router.get(
  "/salesReport/week/:weekStart/:weekEnd",
  isAdmin,
  salesReportHelper.getSalesReportForWeek
);

// Route for getting sales report for a specific month
Router.get(
  "/salesReport/month/:year/:month",
  isAdmin,
  salesReportHelper.getSalesReportForMonth
);
// Route for getting sales report for a specific year
Router.get(
  "/salesReport/year/:year",
  isAdmin,
  salesReportHelper.getSalesReportForYear
);

module.exports = Router;
