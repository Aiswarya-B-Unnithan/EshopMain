const orderCollection = require("../../models/orderModel");
const userCollection = require("../../models/userModel");
const productCollection = require("../../models/userModel");
const WalletTransactionCollection = require("../../models/walletTransactionModel");

// Define the getProductDetails function to fetch product details
async function getProductDetails(productId) {
  console.log("productIdd", productId._id);
  try {
    const product = await productCollection.findById(productId._id).lean();
    if (!product) {
      return null;
    } else {
      return product;
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null; // Handle the error
  }
}

module.exports = {
  viewOrders: async (req, res) => {
    const admin = req.session.admin;
    try {
      const PAGE_SIZE = 7; // Number of items per page
      const page = parseInt(req.query.page, 7) || 1;

      const totalProducts = await orderCollection.countDocuments();
      const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
      const skip = (page - 1) * PAGE_SIZE;

      const allOrders = await orderCollection
        .find()
        .populate({
          path: "cartItems",
          populate: { path: "product", select: "productName" },
        })
        .populate("user", "username")
        .sort()
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean();

      // Loop through allOrders and fetch product details for each cart item
      for (const order of allOrders) {
        for (const cartItem of order.cartItems) {
          cartItem.productDetails = await getProductDetails(cartItem.product);
        }
      }

      res.render("admin/allOrders", {
        orders: allOrders,
        admin,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: PAGE_SIZE,
      });
    } catch (error) {
      res.send(error.message);
    }
  },
  changeStatus: async (req, res) => {
    const orderId = req.params.id;
    try {
      const order = await orderCollection
        .findById(orderId)
        .populate("cartItems.product")
        .populate("user", "username")
        .lean();
      console.log("order", order);
      res.render("admin/orderDetails", { order });
    } catch (error) {}
  },

  updateOrder: async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    let walletTransaction = {};

    try {
      const currentOrder = await orderCollection.findById(orderId);
      const userId = currentOrder.user;

      const ordersToUpdate = await orderCollection.find({
        deliveryDate: { $exists: false },
      });
      const orderid = currentOrder._id;

      for (const order of ordersToUpdate) {
        if (order.status === "delivered") {
          order.deliveryDate = new Date();
          await order.save();
        } else if (order.status === "cancelled") {
          order.adminOrderCancelDate = new Date();
          await order.save();
        }
      }

      if (!currentOrder) {
        return res.render("admin/orderDetails", { message: "Order not found" });
      }

      if (currentOrder.status === "returned") {
        const refundAmount = currentOrder.totalPrice;
        await updateWallet(currentOrder.user, refundAmount);
      }

      if (currentOrder.status === "cancelled") {
        return res.render("admin/orderDetails", {
          message: "Cannot change status of a canceled order",
        });
      }

      currentOrder.status = status;

      // If status is "delivered", set the deliveredDate
      if (status === "delivered") {
        currentOrder.deliveryDate = new Date();
      }
      // If status is "cancelled", set the deliveredDate
      if (status === "cancelled") {
        currentOrder.adminOrderCancelDate = new Date();
        currentOrder.cancelOrderByAdmin = true;
        const refundAmount = currentOrder.totalPrice;
        await updateWallet(currentOrder.user, refundAmount);
        walletTransaction = new WalletTransactionCollection({
          user: userId,
          orderInfo: orderid,
          type: "credit",
          amount: refundAmount,
          description: "Refund Amount",
        });
        await walletTransaction.save();
      }

      // If status is "delivered", set the deliveredDate
      if (status === "returned") {
        currentOrder.returnedDate = new Date();
        const refundAmount = currentOrder.totalPrice;
        await updateWallet(currentOrder.user, refundAmount);
        walletTransaction = new WalletTransactionCollection({
          user: userId,
          orderInfo: orderid,
          type: "credit",
          amount: refundAmount,
          description: "Refund Amount",
        });
        await walletTransaction.save();
      }

      await currentOrder.save();

      res.redirect("/admin/UserOrders/allOrders");
    } catch (error) {
      res.send(error.message);
    }
  },
  getProductDetails: getProductDetails,
};
const updateWallet = async (userId, amount) => {
  try {
    // Find the user by ID and update the wallet balance
    const user = await userCollection.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    // Update the wallet balance
    user.wallet += amount;

    // Save the user
    await user.save();
  } catch (error) {}
};
