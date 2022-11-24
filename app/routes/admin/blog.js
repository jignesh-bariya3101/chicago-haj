const controller = require("../../controllers/admin/blog");
const express = require("express");
const route = express.Router();
const { JwtDecode } = require("../../middleware/auth");
const passport = require("passport");
const { verifyAdminRoles } = require('../../middleware/verifyRoles');

route.post("/",passport.authenticate("jwt", { session: false }), verifyAdminRoles, controller.create);
route.get("/:id", passport.authenticate("jwt", { session: false }), verifyAdminRoles, controller.getById);
route.get("/", passport.authenticate("jwt", { session: false }), verifyAdminRoles, controller.getAll);
route.patch("/:id", passport.authenticate("jwt", { session: false }), verifyAdminRoles, controller.edit);
route.delete("/:id", passport.authenticate("jwt", { session: false }), verifyAdminRoles, controller.remove);
// route.post("/auth/login", validate.login, UserController.login);

module.exports = route;
