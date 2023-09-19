const productCollection = require("../../models/productModel");
const orderCollection = require("../../models/orderModel");
const categoryCollection = require("../../models/categoryModel");
const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const bodyParser = require("body-parser");
const isAdmin = require("../../Middleware/adminAuth");

module.exports = {
  Get_Category_Page: async (req, res) => {
    const admin = req.session.admin;
    categoryCollection
      .find({ deleted: false })
      .lean()
      .then((categories) => {
        res.render("admin/categoryManagement", { categories, admin });
      })
      .catch((error) => {
        res.render("admin/categoryManagement", {
          error: "Error fetching categories",
        });
      });
  },
  get_Add_categorypage: async (req, res) => {
    const admin = req.session.admin;
    res.render("admin/Add-Category", { admin });
  },
  post_new_category: async (req, res) => {
    const categoryName = req.body.name;

    try {
      // Check if a category with the same name already exists (case-insensitive)
      const existingCategory = await categoryCollection
        .findOne({
          name: categoryName,
          deleted: false,
        })
        .collation({ locale: "en", strength: 2 });

      if (existingCategory) {
        console.log("Category already exists:", existingCategory);
        return res.render("admin/Add-Category", {
          messageErr: "Category name already exists",
        });
      } else {
        // Create a new category
        const newCategory = new categoryCollection({
          name: categoryName,
          description: req.body.description,
        });

        newCategory
          .save()
          .then(() => {
            res.redirect("/admin/categories");
          })
          .catch((error) => {
            console.log(error);
            res.redirect("/admin/add-categories");
          });
      }
    } catch (error) {
      res.render("admin/Add-Category", {
        messageErr: "Category already exists",
      });
    }
  },
  Update_Category_Page: async (req, res) => {
    const admin = req.session.admin;
    const categoryId = req.params.id;
    const category = await categoryCollection.findById(categoryId);
    const categoryName = category.name;
    const catId = category._id;
    const catDesc = category.description;
    res.render("admin/Update-Category", {
      categoryName,
      catId,
      catDesc,
      admin,
    });
  },
  Post_Update_Category_Page: async (req, res) => {
    if (!req.session.admin) {
      return res.redirect("/admin/login");
    }
    const categoryName = req.body.name;
    const categoryId = req.params.id;
    try {
      const category = await categoryCollection.findByIdAndUpdate(
        categoryId,
        { name: req.body.name, description: req.body.description },
        { new: true }
      );
      res.redirect("/admin/categories");
    } catch (error) {
      res.render("admin/Add-Category", { messageErr: error });
    }
  },
  Delete_category: async (req, res) => {
    const categoryId = req.params.id;
    categoryCollection
      .findByIdAndUpdate(categoryId, { deleted: true })
      .lean()
      .then(() => {
        res.redirect("/admin/categories");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/admin/categories");
      });
  },
};
