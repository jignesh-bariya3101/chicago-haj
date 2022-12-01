const mongoose = require("mongoose");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ImageGallery = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
            default: null
        },
        type: { type: mongoose.Schema.Types.ObjectId, ref: "FaqType", index: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

ImageGallery.plugin(mongoosePaginate);
ImageGallery.plugin(aggregatePaginate);

module.exports = mongoose.model("ImageGallery", ImageGallery);