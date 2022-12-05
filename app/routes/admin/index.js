const express = require("express");
const route = express.Router();

route.use("/admin", require("./auth"));
route.use("/role", require("./role"));
route.use("/blog", require("./blog"));
route.use("/faq", require("./faq"));
route.use("/faqTypes", require("./faqTypes"));
route.use("/imageGallery", require("./imageGallery"));
route.use("/videoGallery", require("./videoGallery"));

module.exports = route;
