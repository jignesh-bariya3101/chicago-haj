const models = require("../../models").default;
const db = require("../../middleware/db");
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

exports.getAllBlog = async (req, res, next) => {
    try {
        const { filter, page, limit } = req.query;
        const query = {};
        if (filter) {
            query["$or"] = [
                {
                    title: { $regex: filter, $options: "i" },
                },
                {
                    shortDescription: { $regex: filter, $options: "i" },
                },
                {
                    description: { $regex: filter, $options: "i" },
                },
                {
                    status: { $regex: filter, $options: "i" },
                },
            ];
        }
        const getAllRecord = await db.getData({
            req: {
                page: page || 1,
                limit: limit || 10,
                lean: true,
            },
            model: models.Blog,
            query: query,
        });
        for (let index = 0; index < getAllRecord.docs.length; index++) {
            getAllRecord.docs[index].image = `${process.env.BACK_END_URL}/public/blog/${getAllRecord.docs[index].image}`
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

exports.getAllFaq = async (req, res, next) => {
    try {

        const { filter, page, limit } = req.query;
        const query = {}

        if (filter) {
            query["or"] = [
                {
                    title: { $regex: filter, $options: "i" }
                },
                {
                    question: { $regex: filter, $options: "i" },
                },
                {
                    answer: { $regex: filter, $options: "i" },
                }
            ];
        }
        const getAllRecord = await db.getData({
            req: {
                page: page || 1,
                limit: limit || 10,
                populate: [
                    {
                        "path": "faqType"
                    }
                ]
            },
            model: models.FAQ,
            query: query,
        });
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
        })

    }
}

exports.getAllFaqType = async (req, res, next) => {
    try {

        const { filter, page, limit } = req.query;
        const query = {};
        if (filter) {
            query["or"] = [
                {
                    name: { $regex: filter, $options: "i" },
                }
            ];
        }
        const getAllRecord = await db.getData({
            req: {
                page: page || 1,
                limit: limit || 10,
            },
            model: models.FAQTypes,
            query,
        });
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

}

exports.getAllImageGallery = async (req, res, next) => {
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
                lean: true,
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

exports.getAllVideoGallery = async (req, res, next) => {
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
                lean: true,
                populate: [
                    {
                        "path": "addedBy",
                        "select": "email fullName"
                    },
                    {
                        "path": "type",
                        "select": "name"
                    },
                    {
                        "path": "videoCategoryId",
                        "select": "name"
                    },
                ],
            },
            model: models.VideoGallery,
            query: query,
        });
        for (let index = 0; index < getAllRecord.docs.length; index++) {
            getAllRecord.docs[index].image = `${process.env.BACK_END_URL}/public/videoGallery/${getAllRecord.docs[index].video}`
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

exports.getAllCategoryVideoGallery = async (req, res, next) => {
    try {
        const getAllCategory = await db.getAll({ model: models.VideoGalleryCategory, query: {} });
        const { filter, page, limit } = req.query;
        const query = {};
        if (filter) {
            query["$or"] = [
                {
                    description: { $regex: filter, $options: "i" },
                },
            ];
        }
        if (getAllCategory && getAllCategory.length > 0) {
            const response = [];
            for (let index = 0; index < getAllCategory.length; index++) {
                const getAllRecord = await db.getData({
                    req: {
                        page: page || 1,
                        limit: limit || 10,
                        lean: true,
                        populate: [
                            {
                                "path": "addedBy",
                                "select": "email fullName"
                            },
                            {
                                "path": "type",
                                "select": "name"
                            },
                            {
                                "path": "videoCategoryId",
                                "select": "name"
                            },

                        ],
                    },
                    model: models.VideoGallery,
                    query: {
                        videoCategoryId: getAllCategory[index]._id
                    },
                });
                for (let index = 0; index < getAllRecord.docs.length; index++) {
                    getAllRecord.docs[index].video = `${process.env.BACK_END_URL}/public/videoGallery/${getAllRecord.docs[index].video}`
                }
                console.log((getAllRecord.docs.length))
                response.push({
                    categoryId: getAllCategory[index]._id,
                    categoryName: getAllCategory[index].name,
                    videoGallery: getAllRecord.docs
                });
            }
            return res.json({
                status: 200,
                success: true,
                data: response,
                message: "Record(s) found successfully.",
            });
        } else {
            return res.json({
                status: 400,
                success: true,
                data: [],
                message: "Record(s) not found.",
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
}

exports.getAllAirports = async (req, res) => {
    try {
        const { filter, page, limit } = req.query;
        const query = {};
        if (filter) {
            query["$or"] = [
                {
                    airportId: { $regex: filter, $options: "i" },
                },
                {
                    name: { $regex: filter, $options: "i" },
                },
                {
                    city: { $regex: filter, $options: "i" },
                },
                {
                    country: { $regex: filter, $options: "i" },
                },
                {
                    iata: { $regex: filter, $options: "i" },
                },
                {
                    icao: { $regex: filter, $options: "i" },
                },
                {
                    lat: { $regex: filter, $options: "i" },
                },
                {
                    long: { $regex: filter, $options: "i" },
                },
                {
                    altitude: { $regex: filter, $options: "i" },
                },
                {
                    timezone: { $regex: filter, $options: "i" },
                },

                {
                    dst: { $regex: filter, $options: "i" },
                },

                {
                    databaseTimezone: { $regex: filter, $options: "i" },
                },

                {
                    type: { $regex: filter, $options: "i" },
                },

                {
                    source: { $regex: filter, $options: "i" },
                },
            ];
        }
        const getLngth = await models.Airport.find().count();
        console.log("getLngth", getLngth);
        const getAllRecord = await db.getData({
            req: {
                page: page || 1,
                limit: limit || 10,
                lean: true,
            },
            model: models.Airport,
            query: query,
        });
        return res.json({
            status: 200,
            success: true,
            data: getAllRecord,
            message: "Record(s) found successfully.",
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