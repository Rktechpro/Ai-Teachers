import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'Advanced']
    },
    language: {
        type: String,
        required: true,
        enum: ['english', 'hinglish']
    },
    chapters: [String]

}, { timestamps: true });

export const topicModel = mongoose.model("Topic", topicSchema);
