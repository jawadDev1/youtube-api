import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: [true, "Video File is required"]
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"]
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    }

}, {timestamps: true})

mongoose.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)