const AdminController = require("../../controllers/admin/admin");
const express = require("express");
const route = express.Router();
const { JwtDecode } = require("../../middleware/auth");
const passport = require("passport");
const { verifyAdminRoles } = require('../../middleware/verifyRoles');

route.post("/signup", AdminController.signUpAdmin);
route.post("/login", AdminController.adminLogin);
route.post("/user", passport.authenticate("jwt", { session: false }), verifyAdminRoles, AdminController.createAdminUser);
route.get("/getAllUser", passport.authenticate("jwt", { session: false }), verifyAdminRoles, AdminController.getAdminUsers);
route.get("/user/:id", passport.authenticate("jwt", { session: false }), verifyAdminRoles, AdminController.getUserById);
route.patch("/user/:id", passport.authenticate("jwt", { session: false }), verifyAdminRoles, AdminController.updateUser);
route.delete("/user/:id", passport.authenticate("jwt", { session: false }), verifyAdminRoles, AdminController.deleteUser);
// route.post("/auth/login", validate.login, UserController.login);

module.exports = route;
