"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterRouter = void 0;
const express_1 = require("express");
const chapter_controller_1 = require("./chapter.controller");
exports.ChapterRouter = (0, express_1.Router)();
exports.ChapterRouter.get("/", chapter_controller_1.fetchChapter);
exports.ChapterRouter.get("/:id", chapter_controller_1.fetchChapterById);
exports.ChapterRouter.post("/", chapter_controller_1.createChapter);
exports.ChapterRouter.put("/:id", chapter_controller_1.updateChapter);
exports.ChapterRouter.delete("/:id", chapter_controller_1.deleteChapter);
//# sourceMappingURL=chapter.route.js.map