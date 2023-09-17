const cartCollection = require("../models/cartModel");
const Category = require("../models/categoryModel");
const productCollection = require("../models/productModel");
const ObjectId = require("objectid");
const couponCollection = require("../models/couponModel");
module.exports = {
  addToCart: (prodId, userId, quantity, price, offerPrice) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the user already has a cart
        let existingCart = await cartCollection
          .findOne({ user: userId })
          .lean();

        if (existingCart) {
          // If the user already has a cart, check if the product exists in the cart items
          const existingItem = existingCart.items.find(
            (item) => item.product.toString() === prodId
          );

          if (existingItem) {
            console.log("true");
            // If the product exists in the cart items, update the quantity
            existingItem.quantity += quantity;
          } else {
            // If the product does not exist in the cart items, add it to the cart
            if (offerPrice > 0) {
              console.log("offer is there");
              existingCart.items.push({
                product: prodId,
                quantity,
                price,
                offerPrice,
              });
            } else {
              existingCart.items.push({
                product: prodId,
                quantity,
                price,
                offerPrice,
              });
            }
          }

          // Save the updated cart
          await cartCollection.findByIdAndUpdate(
            existingCart._id,
            existingCart
          );
          resolve();
        } else {
          // If the user does not have a cart, create a new cart and add the product
          const newCart = new cartCollection({
            user: userId,
            items: [{ product: prodId, quantity, price, offerPrice }],
          });
          await newCart.save();
          resolve();
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    });
  },
  updateQuantity: async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
      // Find the user's cart
      const cart = await cartCollection.findOne({ user: req.session.user._id });
      if (!cart) {
        return res.send(404).json({ error: "Cart not found" });
      }

      // Check if the product exists in the cart items
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (!existingItem) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

      // Update the quantity
      existingItem.quantity = parseInt(quantity);

      // Save the updated cart
      await cart.save();

      const updatedTotalPrice = calculateTotalPrice(cart);
      const updatedTotalAmountWithOutDiscount =
        calculateTotalAmountWithOutDiscount(cart);

      // Update the totalPrice property in the cart object
      cart.totalPrice = updatedTotalPrice;

      // Save the updated cart
      await cart.save();

      // Check available coupons
      const availableCoupons = await checkAvailableCoupons(
        cart,
        updatedTotalPrice
      );

      // Calculate tax amount
      const taxAmount = calculateTaxAmount(updatedTotalPrice);

      // Calculate total amount with tax
      const totalAmountWithTax = updatedTotalPrice + taxAmount;

      // Update the totalPrice property in the cart object
      cart.totalPrice = updatedTotalPrice;

      // Save the updated cart
      await cart.save();

      return res.status(200).json({
        message: "Quantity updated successfully",
        cart: cart, // Include the updated cart in the response
        updatedTotalPrice: updatedTotalPrice, // Include the updated total price
        updatedTotalAmountWithOutDiscount: updatedTotalAmountWithOutDiscount, // Include the updated totalAmountWithOutDiscount
        availableCoupons: availableCoupons, // Include available coupons
        taxAmount: taxAmount, // Include tax amount
        totalAmountWithTax: totalAmountWithTax, // Include total amount with tax
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteProduct: async (req, res) => {
    const productId = req.params.productId;

    try {
      // Find the user's cart
      const cart = await cartCollection.findOne({ user: req.session.user._id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      // Remove the product from the cart items
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
      // Save the updated cart
      await cart.save();
      res.json({
        message: "Item removed from wishlist!",
        status: true,
      });
    } catch (err) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  checkIfProductInCart: async (req, res) => {
    const userId = req.session.user._id;
    const productId = req.params.productId;
    console.log("cart");
    console.log("productId");
    const cart = await cartCollection.findOne({
      user: userId,
      "items.product": productId,
    });

    if (cart) {
      return res.status(200).json({ inCart: true });
    } else {
      return res.status(200).json({ inCart: false });
    }
  },
};
// Define a function to calculate the total price of items in the cart
function calculateTotalPrice(cart) {
  let totalPrice = 0;

  for (const item of cart.items) {
    if (item.offerPrice) {
      totalPrice += item.offerPrice * item.quantity;
    } else {
      totalPrice += item.price * item.quantity;
    }
  }

  return totalPrice;
}
// Define a function to calculate the total amount without any discounts
function calculateTotalAmountWithOutDiscount(cart) {
  let totalAmountWithOutDiscount = 0;

  for (const item of cart.items) {
    totalAmountWithOutDiscount += item.price * item.quantity;
  }

  return totalAmountWithOutDiscount;
}

async function checkAvailableCoupons(cart, updatedTotalPrice) {
  const userCart = await cartCollection
    .findOne({ _id: cart._id }) // Use cart._id instead of userId
    .populate("items.product")
    .lean();

  const productCategories = userCart.items.map((item) => item.product.category);
  const uniqueCategories = [...new Set(productCategories)];

  const categories = await Category.find({
    _id: { $in: uniqueCategories },
  }).lean();

  const categoryNames = categories.map((category) => category.name);

  let availableCoupons = [];

  if (updatedTotalPrice >= 1000) {
    availableCoupons = await couponCollection
      .find({
        category: { $in: categoryNames },
        validUntil: { $gte: new Date() },
        minCartAmount: { $lte: updatedTotalPrice }, // Check if minCartAmount is less than or equal to updatedTotalPrice
      })
      .lean();
  }

  return availableCoupons;
}
function calculateTaxAmount(totalAmountWithOutDiscount) {
  const taxPercentage = 0.05; // You can adjust the tax rate as needed
  const taxAmount = totalAmountWithOutDiscount * taxPercentage;
  return taxAmount;
}
