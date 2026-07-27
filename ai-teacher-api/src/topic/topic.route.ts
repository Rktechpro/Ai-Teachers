import { Router } from "express";

import {
    createTopic,
    deleteTopic,
    fetchTopic,
    fetchTopicById,
    updateTopic,
} from "./topic.controller";

export const TopicRouter = Router();

TopicRouter.get("/", fetchTopic);
TopicRouter.get("/:id", fetchTopicById);
TopicRouter.post("/", createTopic);
TopicRouter.put("/:id", updateTopic);
TopicRouter.delete("/:id", deleteTopic);
