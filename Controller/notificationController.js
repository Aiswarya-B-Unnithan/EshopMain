const express = require("express");
const Router = express.Router();
const isAdmin = require("../Middleware/adminAuth");
const notificationHelper = require("../Helpers/Admin_Helpers/notificationHelper");
Router.get("/notifications", isAdmin, notificationHelper.getNotification);
Router.get("/view_order/:id", isAdmin, notificationHelper.viewOrder);

module.exports = Router;
