"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopic = exports.updateTopic = exports.fetchTopicById = exports.fetchTopic = exports.createTopic = void 0;
const topic_model_1 = require("./topic.model");
const createTopic = async (req, res) => {
    try {
        const { name, description } = req.body;
        const topic = await topic_model_1.topicModel.create({ name, description });
        res.status(201).json({ message: "Topic created successfully", data: topic });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.createTopic = createTopic;
const fetchTopic = async (_req, res) => {
    try {
        const topics = await topic_model_1.topicModel.find().sort({ createdAt: -1 });
        if (!topics)
            throw new Error("Topic is Not Found");
        res.status(200).json(topics);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.fetchTopic = fetchTopic;
const fetchTopicById = async (req, res) => {
    try {
        const { id } = req.params;
        const topic = await topic_model_1.topicModel.findById(id);
        if (!topic) {
            res.status(404).json({ message: "Topic not found" });
            return;
        }
        res.status(200).json({ data: topic });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.fetchTopicById = fetchTopicById;
const updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const topic = await topic_model_1.topicModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!topic) {
            res.status(404).json({ message: "Topic not found" });
            return;
        }
        res.status(200).json({ message: "Topic updated successfully", data: topic });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.updateTopic = updateTopic;
const deleteTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const topic = await topic_model_1.topicModel.findByIdAndDelete(id);
        if (!topic) {
            res.status(404).json({ message: "Topic not found" });
            return;
        }
        res.status(200).json({ message: "Topic deleted successfully" });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.deleteTopic = deleteTopic;
//# sourceMappingURL=topic.controller.js.map