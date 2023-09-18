const express = require("express");
const Router = express.Router();
const isAdmin = require("../Middleware/adminAuth");
// const isAdmin = require("../Middleware/adminAuth");
const ordermanagement_helper = require("../Helpers/Admin_Helpers/ordermanagement_helper");
Router.get("/allOrders", ordermanagement_helper.viewOrders);
Router.get("/changeStatus/:id", isAdmin, ordermanagement_helper.changeStatus);
Router.post("/:id/updateStatus", isAdmin, ordermanagement_helper.updateOrder);
module.exports = Router;
