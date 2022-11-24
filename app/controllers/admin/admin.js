const models = require("../../models").default;
const db = require("../../middleware/db");
const bcrypt = require("bcrypt");
const { JwtSign } = require("../../middleware/auth");
const { MAIN_ADMIN, MAIN_USER } = require("../../middleware/constant");
const { sendMail } = require("../../helpers/mail");
const config = require("../../../config/config");

const signUpAdmin = async (req, res, next) => {
  try {
    const getUser = await db.findData({
      req: {},
      model: models.User,
      query: {
        email: req.body.email,
      },
    });
    console.log("getUser :>> ", getUser);
    if (getUser) {
      return res.json({
        status: 400,
        success: false,
        error: false,
        message: "Provided email address already exists.",
      });
    } else {
      const createUser = await db.create(req.body, models.User);
      return res.status(201).json({
        success: true,
        data: {
          userId: createUser._id,
          email: createUser.email,
        },
        message: "Admin registered successfully.",
      });
    }
  } catch (error) {
    return res.status(error.code ? error.code : 500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

/**
 *
 * @param {email,password} req
 * @param {token} res
 * @param {*} next
 * @returns
 */
const adminLogin = async (req, res, next) => {
  try {
    console.log('req.body.email :>> ', req.body.email);
    const getUser = await db.findData({
      req: {},
      model: models.User,
      query: {
        email: req.body.email,
      },
    });
    console.log('getUser :>> ', getUser);
    if (getUser) {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        getUser.password
      );
      console.log("checkPassword :>> ", checkPassword);
      if (checkPassword) {
        const getRole = await db.findData({
          req: {},
          model: models.Role,
          query: {
            _id: getUser.role,
          },
        });
        if (getRole && getRole.name !== MAIN_ADMIN) {
          return res.json({
            status: 400,
            success: false,
            data: null,
            message: "Un-Authorized.",
          });
        }
        const payload = {
          userId: getUser._id,
          email: getUser.email,
          fullName: getUser.fullName,
          role: getUser.user_type,
        };
        const token = await JwtSign(payload);
        return res.status(200).json({
          success: true,
          status: 200,
          data: {
            token: token,
          },
          message: "LoggedIn Successfully.",
        });
      }
    } else {
      return res.json({
        status: 400,
        success: false,
        data: null,
        message: "Email address not found.",
      });
    }
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(error.code ? error.code : 500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

const createAdminUser = async (req, res, nex) => {
  try {
    const getUser = await db.findData({
      req: {},
      model: models.User,
      query: {
        email: req.body.email,
      },
    });

    console.log("getUser :>> ", getUser);
    if (getUser) {
      return res.json({
        status: 400,
        success: false,
        error: false,
        message: "Provided email address already exists.",
      });
    } else {
      req.body.addedBy = req.user._id;
      const createUser = await db.create(req.body, models.User);
      if (createUser) {
        return res.status(201).json({
          success: true,
          data: {
            userId: createUser._id,
            email: createUser.email,
          },
          message: "User registered successfully.",
        });
      }
    }
  } catch (error) {
    return res.status(error.code ? error.code : 500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getRecordById = await db.findById(id, models.User, "role");
    return res.status(200).json({
      success: true,
      status: 200,
      data: getRecordById,
      message: "Record found successfully.",
    });
  } catch (error) {
    return res.status(error.code ? error.code : 500).json({
      success: false,
      status: error.code ? error.code : 500,
      error: true,
      message: error.message,
    });
  }
};

const getAdminUsers = async (req, res, next) => {
  try {
    const { filter, page, limit } = req.query;
    const query = {
      addedBy: req.user._id,
    };
    if (filter) {
      query["$or"] = [
        {
          fullName: { $regex: filter, $options: "i" },
        },
        {
          designation: { $regex: filter, $options: "i" },
        }
      ];
    }
    console.log(JSON.stringify(query, null, 2));
    const getUser = await db.getData({
      req: {
        page: page || 1,
        limit: limit || 10,
        populate: [{
          path: "role"
        }]
      },
      model: models.User,
      query: query,
    });
    return res.json({
      status: 200,
      success: true,
      data: getUser,
      message: "User's record(s) found successfully..",
    });
  } catch (error) {
    return res.status(error.code ? error.code : 500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const getRecordById = await db.findById(id, models.User);
    if (!getRecordById) {
      return res.status(400).json({
        success: false,
        status: 400,
        data: getRecordById,
        message: "Record not found by provided id.",
      });
    }
    const updateRecord = await db.updateData(
      id,
      models.User,
      req.body
    );
    return res.status(200).json({
      success: true,
      status: 200,
      data: updateRecord,
      message: "Record updated successfully.",
    });
  } catch (error) {
    return res.status(error.code ? error.code : 500).json({
      success: false,
      status: error.code ? error.code : 500,
      error: true,
      message: error.message,
    });
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getRecordById = await db.findById(id, models.User);
    if (!getRecordById) {
      return res.status(400).json({
        success: false,
        status: 400,
        data: getRecordById,
        message: "Record not found by provided id.",
      });
    }
    const removeRecord = await db.delete(id, models.User);
    return res.status(200).json({
      success: true,
      status: 200,
      data: removeRecord,
      message: "Record deleted successfully.",
    });
  } catch (error) {
    return res.status(error.code ? error.code : 500).json({
      success: false,
      status: error.code ? error.code : 500,
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  signUpAdmin,
  adminLogin,
  createAdminUser,
  getAdminUsers,
  getUserById,
  updateUser,
  deleteUser
};
