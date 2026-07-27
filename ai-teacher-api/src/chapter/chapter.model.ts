import { model, Schema } from "mongoose";

const chapterSchema = new Schema(
    {
        topic: {
            type: Schema.Types.ObjectId,
            ref: "Topic",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

export const chapterModel = model("Chapter", chapterSchema);
