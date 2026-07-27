import { Router } from "express";

import {
    createChapter,
    deleteChapter,
    fetchChapter,
    fetchChapterByTopicId,
    updateChapter,
} from "./chapter.controller";

export const ChapterRouter = Router();

ChapterRouter.get("/", fetchChapter);
ChapterRouter.get("/:topicId", fetchChapterByTopicId);
ChapterRouter.post("/", createChapter);
ChapterRouter.put("/:id", updateChapter);
ChapterRouter.delete("/:id", deleteChapter);
