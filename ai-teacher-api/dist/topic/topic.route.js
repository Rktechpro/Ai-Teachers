"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicRouter = void 0;
const express_1 = require("express");
const topic_controller_1 = require("./topic.controller");
exports.TopicRouter = (0, express_1.Router)();
exports.TopicRouter.get("/", topic_controller_1.fetchTopic);
exports.TopicRouter.get("/:id", topic_controller_1.fetchTopicById);
exports.TopicRouter.post("/", topic_controller_1.createTopic);
exports.TopicRouter.put("/:id", topic_controller_1.updateTopic);
exports.TopicRouter.delete("/:id", topic_controller_1.deleteTopic);
//# sourceMappingURL=topic.route.js.map