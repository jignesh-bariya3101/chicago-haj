const controller = require("../../controllers/admin/role");
const express = require("express");
const route = express.Router();
const { JwtDecode } = require("../../middleware/auth");
const passport = require("passport");
const { verifyAdminRoles } = require('../../middleware/verifyRoles');

route.post("/", controller.create);
route.get("/:id", passport.authenticate("jwt", { session: false }), verifyAdminRoles, controller.getById);
route.get("/", controller.getAll);
route.patch("/:id", passport.authenticate("jwt", { session: false }), verifyAdminRoles, controller.edit);
route.delete("/:id", passport.authenticate("jwt", { session: false }), verifyAdminRoles, controller.remove);
// route.post("/auth/login", validate.login, UserController.login);

module.exports = route;
