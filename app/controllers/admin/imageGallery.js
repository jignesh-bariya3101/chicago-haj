const models = require("../../models").default;
const db = require("../../middleware/db");
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

exports.create = async (req, res, nex) => {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            const { description, type } = fields;
            const { image } = files;

            try {
                const createObject = {
                    description,
                    type,
                    addedBy: req.user._id,
                }
                const createRecord = await db.create(
                    createObject,
                    models.ImageGallery
                );
                if (image) {
                    var ext = image.name.substring(
                        image.name.indexOf("."),
                        image.name.length
                    );
                    if (ext === ".jpeg" || ext === ".jpg" || ext === ".JPEG" || ext === ".JPG" || ext === ".png" || ext === ".PNG") {
                        var NewName = "imageGallery-" + Math.floor((Math.random() * 1000000) + 1);;
                        if (ext.indexOf("?") > -1) {
                            ext = ext.substring(0, ext.indexOf("?"));
                        }
                        console.log('ext :>> ', ext);
                        form.uploadDir =
                            path.join(
                                __dirname,
                                "../../../public/imageGallery"
                            ) +
                            "/" +
                            NewName +
                            ext;
                        var oldPath = image.path;
                        var newPath =
                            path.join(
                                __dirname,
                                "../../../public/imageGallery"
                            ) +
                            "/" +
                            NewName +
                            ext;
                        console.log('newPath :>> ', newPath);
                        console.log('oldPath :>> ', oldPath);
                        var rawData = fs.readFileSync(oldPath);
                        console.log('rawData :>> ', rawData);
                        fs.writeFile(newPath, rawData, async function (err) {
                            if (!err) {
                                try {
                                    const updateObject = {
                                        image: NewName + ext,
                                    };
                                    const updateImage = await db.update(createRecord._id, models.ImageGallery, updateObject);
                                    console.log('updateImage :>> ', updateImage);
                                    const getGallery = await db.findData({
                                        req: {},
                                        model: models.ImageGallery,
                                        query: {
                                            _id: createRecord._id
                                        },
                                        options: {
                                            populate: [
                                                {
                                                    "path": "addedBy",
                                                    "select": "email fullName"
                                                },
                                                {
                                                    "path": "type",
                                                    "select": "name"
                                                },

                                            ],
                                            lean: true
                                        }
                                    })
                                    getGallery["image"] = `${process.env.BACK_END_URL}/public/imageGallery/${getGallery.image}`;
                                    return res.status(201).json({
                                        success: true,
                                        status: 201,
                                        data: getGallery,
                                        message: "Record created successfully.",
                                    });
                                } catch (error) {
                                    console.log('error.message :>> ', error.message);
                                    await db.delete(createRecord._id, models.ImageGallery);
                                    return res.status(error.code ? error.code : 500).json({
                                        success: false,
                                        status: error.code ? error.code : 500,
                                        error: true,
                                        message: error.message,
                                    });
                                }
                            } else {
                                await db.delete(createRecord._id, models.ImageGallery);
                                console.log("Not Uploaded", err);
                                return res.status(500).json({
                                    success: false,
                                    status: 500,
                                    error: true,
                                    message: err.message,
                                });
                            }
                        });
                    } else {
                        await db.delete(createRecord._id, models.ImageGallery);
                        return res.status(400).json({
                            success: false,
                            status: 400,
                            error: true,
                            message: "Please select only image file.",
                        });
                    }
                } else {
                    const getGallery = await db.findData({
                        req: {},
                        model: models.ImageGallery,
                        query: {
                            _id: createRecord._id
                        },
                        options: {
                            populate: [
                                {
                                    "path": "addedBy",
                                    "select": "email fullName"
                                },
                                {
                                    "path": "type",
                                    "select": "name"
                                },

                            ],
                            lean: true
                        }
                    })
                    // getGallery["imagePath"] = "/public/imageGallery/"
                    getGallery["image"] = `${process.env.BACK_END_URL}/public/imageGallery/${getGallery.image}`;
                    return res.status(201).json({
                        success: true,
                        status: 201,
                        data: getGallery,
                        message: "Record created successfully.",
                    });
                }

            } catch (error) {
                console.log('error.message :>> ', error.message);
                return res.status(error.code ? error.code : 500).json({
                    success: false,
                    status: error.code ? error.code : 500,
                    error: true,
                    message: error.message,
                });
            }

        });

        form.on("error", function (err) {
            console.log("err", err.message);
            return res.status(500).json({
                success: false,
                status: 500,
                error: true,
                message: err.message,
            });
        });
    } catch (error) {
        console.log('error.message :>> ', error.message);
        return res.status(error.code ? error.code : 500).json({
            success: false,
            status: error.code ? error.code : 500,
            error: true,
            message: error.message,
        });
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const { filter, page, limit } = req.query;
        const query = {};
        if (filter) {
            query["$or"] = [
                {
                    description: { $regex: filter, $options: "i" },
                },
            ];
        }
        const getAllRecord = await db.getData({
            req: {
                page: page || 1,
                limit: limit || 10,
                populate: [
                    {
                        "path": "addedBy",
                        "select": "email fullName"
                    },
                    {
                        "path": "type",
                        "select": "name"
                    },

                ],
                lean:true
            },
            model: models.ImageGallery,
            query: query,
        });

        for (let index = 0; index < getAllRecord.docs.length; index++) {
            getAllRecord.docs[index].image = `${process.env.BACK_END_URL}/public/imageGallery/${getAllRecord.docs[index].image}`
        }

        return res.json({
            status: 200,
            success: true,
            data: getAllRecord,
            message: "Record(s) found successfully..",
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

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getGallery = await db.findData({
            req: {},
            model: models.ImageGallery,
            query: {
                _id: id
            },
            options: {
                populate: [

                    {
                        "path": "addedBy",
                        "select": "email fullName"
                    },
                    {
                        "path": "type",
                        "select": "name"
                    },
                ],
                lean: true
            }
        })
        getGallery && getGallery !== null ? getGallery["image"] = `${process.env.BACK_END_URL}/public/imageGallery/${getGallery.image}`: "";
        return res.status(200).json({
            success: true,
            status: 200,
            data: getGallery,
            message: "Record fetched successfully.",
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

exports.edit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getRecordById = await db.findById(id, models.ImageGallery);
        if (!getRecordById) {
            return res.status(400).json({
                success: false,
                status: 400,
                data: getRecordById,
                message: "Record not found by provided id.",
            });
        }
        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            try {
                const { image } = files;
                const updateData = await db.update(getRecordById._id, models.ImageGallery, fields);
                console.log('updateData :>> ', updateData);
                if (image) {
                    var ext = image.name.substring(
                        image.name.indexOf("."),
                        image.name.length
                    );
                    if (ext === ".jpeg" || ext === ".jpg" || ext === ".JPEG" || ext === ".JPG" || ext === ".png" || ext === ".PNG") {
                        var NewName = "imageGallery-" + Math.floor((Math.random() * 1000000) + 1);;
                        if (ext.indexOf("?") > -1) {
                            ext = ext.substring(0, ext.indexOf("?"));
                        }
                        console.log('ext :>> ', ext);
                        form.uploadDir =
                            path.join(
                                __dirname,
                                "../../../public/imageGallery"
                            ) +
                            "/" +
                            NewName +
                            ext;
                        var oldPath = image.path;
                        var newPath =
                            path.join(
                                __dirname,
                                "../../../public/imageGallery"
                            ) +
                            "/" +
                            NewName +
                            ext;
                        console.log('newPath :>> ', newPath);
                        console.log('oldPath :>> ', oldPath);
                        var rawData = fs.readFileSync(oldPath);
                        console.log('rawData :>> ', rawData);
                        if (getRecordById && getRecordById.image !== null) {
                            const oldImage = path.join(
                                __dirname,
                                "../../../public/imageGallery"
                            ) +
                                "/" + getRecordById.image
                            fs.unlink(oldImage, (err) => {
                                if (!err) console.log("File Removed Successfully.");
                            });
                        }
                        fs.writeFile(newPath, rawData, async function (err) {
                            if (!err) {
                                const updateObject = {
                                    image: NewName + ext,
                                };
                                const updateImage = await db.update(getRecordById._id, models.ImageGallery, updateObject);
                                console.log("Hello");
                                console.log('updateImage :>> ', updateImage);
                                const getGallery = await db.findData({
                                    req: {},
                                    model: models.ImageGallery,
                                    query: {
                                        _id: getRecordById._id
                                    },
                                    options: {
                                        populate: [
                                            {
                                                "path": "addedBy",
                                                "select": "email fullName"
                                            },
                                            {
                                                "path": "type",
                                                "select": "name"
                                            }
                                        ],
                                        lean: true
                                    }
                                })
                                getGallery["image"] = `${process.env.BACK_END_URL}/public/imageGallery/${getGallery.image}`;
                                return res.status(200).json({
                                    success: true,
                                    status: 200,
                                    data: getGallery,
                                    message: "Record updated successfully.",
                                });
                            } else {
                                console.log("Not Uploaded", err);
                            }
                        });
                    } else {
                        return res.status(400).json({
                            success: false,
                            status: 400,
                            error: true,
                            message: "Please select only image file.",
                        });
                    }
                } else {
                    const getGallery = await db.findData({
                        req: {},
                        model: models.ImageGallery,
                        query: {
                            _id: getRecordById._id
                        },
                        options: {
                            populate: {
                                "path": "addedBy",
                                "select": "email fullName"
                            },
                            lean: true
                        }
                    })
                    getGallery["image"] = `${process.env.BACK_END_URL}/public/imageGallery/${getGallery.image}`;
                    return res.status(200).json({
                        success: true,
                        status: 200,
                        data: getGallery,
                        message: "Record updated successfully.",
                    });
                }


            } catch (error) {
                return res.status(error.code ? error.code : 500).json({
                    success: false,
                    status: error.code ? error.code : 500,
                    error: true,
                    message: error.message,
                });
            }
        });

        form.on("error", function (err) {
            console.log("err", err.message);
            return res.status(500).json({
                success: false,
                status: 500,
                error: true,
                message: err.message,
            });
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

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getRecordById = await db.findById(id, models.ImageGallery);
        if (!getRecordById) {
            return res.status(400).json({
                success: false,
                status: 400,
                data: getRecordById,
                message: "Record not found by provided id.",
            });
        }
        if (getRecordById && getRecordById.image !== null) {
            const oldImage = path.join(
                __dirname,
                "../../../public/imageGallery"
            ) +
                "/" + getRecordById.image
            fs.unlink(oldImage, (err) => {
                if (!err) console.log("File Removed Successfully.");
            });
        }
        const removeRecord = await db.delete(id, models.ImageGallery);
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