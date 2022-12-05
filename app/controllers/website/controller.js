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
            },
            model: models.Blog,
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
        });
    }
};

exports.getAllFaq = async (req,res,next) => {
    try {

        const { filter , page , limit } = req.query;
        const query = {}

        if(filter) {
            query["or"] = [
                {
                    title : {$regex: filter, $options: "i"}
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
            error : true,
            message : error.message,
        })
        
    }
}

exports.getAllFaqType = async (req , res , next) => {
try {

    const { filter, page, limit} = req.query;
    const query = {};
    if(filter) {
        query["or"] = [
            {
                name: {$regex : filter , $options : "i"},
            }
        ];
    }
    const getAllRecord = await db.getData({
        req: {
            page: page || 1,
            limit : limit || 10,
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
            model: models.VideoGallery,
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
        });
    }
};