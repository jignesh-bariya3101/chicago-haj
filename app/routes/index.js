const express = require("express");
const route = express.Router();

route.use(require("./admin"));
route.use(require("./user"));


module.exports = route;
