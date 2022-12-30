const mongoose = require("mongoose");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const VideoGallery = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        video: {
            type: String,
            required: false,
            default: null
        },
        type: { type: mongoose.Schema.Types.ObjectId, ref: "FaqType", index: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        videoCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "VideoGalleryCategory", index: true },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

VideoGallery.plugin(mongoosePaginate);
VideoGallery.plugin(aggregatePaginate);

module.exports = mongoose.model("VideoGallery", VideoGallery);