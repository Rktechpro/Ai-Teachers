import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

import { ChapterRouter } from "./chapter/chapter.route";
import { TopicRouter } from "./topic/topic.route";


const app = express();
const port = Number(process.env.PORT) || 8080;
const databaseUrl = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/topic", TopicRouter);
app.use("/chapter", ChapterRouter);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "AI Teacher API is running" });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found", });
});

const startServer = async (): Promise<void> => {
    try {
        if (!databaseUrl) {
            throw new Error("DATABASE_URL is not configured in the .env file.");
        }

        await mongoose.connect(databaseUrl);
        console.log("Database connected");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    }
    catch (err) {
        console.log(err)
    }
}
startServer()
