"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapterModel = void 0;
const mongoose_1 = require("mongoose");
const chapterSchema = new mongoose_1.Schema({
    topic: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Topic",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.chapterModel = (0, mongoose_1.model)("Chapter", chapterSchema);
//# sourceMappingURL=chapter.model.js.map