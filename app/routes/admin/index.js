const express = require("express");
const route = express.Router();

route.use("/admin", require("./auth"));
route.use("/role", require("./role"))
route.use("/blog", require("./blog"))
route.use("/faq", require("./faq"))

module.exports = route;
