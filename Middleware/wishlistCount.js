// // categoryMiddleware.js
// const wishlistCollection = require("../models/whishlistModel");

// // Middleware function to fetch all categories and make it available to all routes

// const whishListCount = async (req, res, next) => {
//   const userId = req.session.user._id;

//   try {
//     const wishList = await wishlistCollection.findOne({ user: userId });

//     if (!wishList.length === 0) {
//       const itemCount = wishList.items.length;
//       res.locals.wishList_Count = itemCount;
//       console.log("whishListCount", res.locals.wishList_Count);
//       req.session.wishList_Count = res.locals.wishList_Count;
//     } else {
//       res.locals.wishList_Count = 0;
//       req.session.wishList_Count = res.locals.wishList_Count;
//     }

//     next();
//   } catch (error) {
//     console.log("Error fetching wishList:", error);
//     res.locals.wishList_Count = 0;
//     next();
//   }
// };

// module.exports = { whishListCount };
