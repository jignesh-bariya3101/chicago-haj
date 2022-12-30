const controller = require("../../controllers/website/controller");
const express = require("express");
const route = express.Router();
const { JwtDecode } = require("../../middleware/auth");
const passport = require("passport");
const { verifyAdminRoles } = require('../../middleware/verifyRoles');

route.get("/website/getAllBlog", controller.getAllBlog);
route.get("/website/getAllFaq", controller.getAllFaq);
route.get("/website/getAllFaqType", controller.getAllFaqType);
route.get("/website/getAllImageGallery", controller.getAllImageGallery);
route.get("/website/getAllVideoGallery", controller.getAllVideoGallery);
route.get("/website/getCategoryViseVideoGallery", controller.getAllCategoryVideoGallery);
route.get("/website/getAllAirports", controller.getAllAirports);


module.exports = route;