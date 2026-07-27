"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicModel = void 0;
const mongoose_1 = require("mongoose");
const topicSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.topicModel = (0, mongoose_1.model)("Topic", topicSchema);
//# sourceMappingURL=topic.model.js.map