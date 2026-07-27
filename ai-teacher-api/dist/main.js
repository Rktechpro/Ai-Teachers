"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const chapter_route_1 = require("./chapter/chapter.route");
const topic_route_1 = require("./topic/topic.route");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8080;
const databaseUrl = process.env.DATABASE_URL;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/topic", topic_route_1.TopicRouter);
app.use("/chapter", chapter_route_1.ChapterRouter);
app.get("/", (req, res) => {
    res.status(200).json({ message: "AI Teacher API is running" });
});
app.use((req, res) => {
    res.status(404).json({ message: "Route not found", });
});
const startServer = async () => {
    try {
        if (!databaseUrl) {
            throw new Error("DATABASE_URL is not configured in the .env file.");
        }
        await mongoose_1.default.connect(databaseUrl);
        console.log("Database connected");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (err) {
        console.log(err);
    }
};
startServer();
//# sourceMappingURL=main.js.map