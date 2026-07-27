"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChapter = exports.updateChapter = exports.fetchChapterById = exports.fetchChapter = exports.createChapter = void 0;
const chapter_model_1 = require("./chapter.model");
const createChapter = async (req, res) => {
    try {
        const { topic, name, content } = req.body;
        const chapter = await chapter_model_1.chapterModel.create({ topic, name, content });
        res.status(201).json({ message: "Chapter created successfully", data: chapter });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.createChapter = createChapter;
const fetchChapter = async (_req, res) => {
    try {
        const chapters = await chapter_model_1.chapterModel.find().populate("topic").sort({ createdAt: -1 });
        res.status(200).json(chapters);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.fetchChapter = fetchChapter;
const fetchChapterById = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await chapter_model_1.chapterModel.findById(id).populate("topic");
        if (!chapter) {
            res.status(404).json({ message: "Chapter not found" });
            return;
        }
        res.status(200).json({ data: chapter });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.fetchChapterById = fetchChapterById;
const updateChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await chapter_model_1.chapterModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!chapter) {
            res.status(404).json({ message: "Chapter not found" });
            return;
        }
        res.status(200).json({ message: "Chapter updated successfully", data: chapter });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.updateChapter = updateChapter;
const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await chapter_model_1.chapterModel.findByIdAndDelete(id);
        if (!chapter) {
            res.status(404).json({ message: "Chapter not found" });
            return;
        }
        res.status(200).json({ message: "Chapter deleted successfully" });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};
exports.deleteChapter = deleteChapter;
//# sourceMappingURL=chapter.controller.js.map