import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from "express";
import { topicModel } from "./topic.model";
import { getSystemPromptForTopic, getUserPromptForTopic } from "./topic.propmt";
import { getContentOfAI, PromptInterface } from '../ai/ai.service';


export const createTopic = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const count = await topicModel.countDocuments({
            name: body.name.toLowerCase(),
        });

        if (count > 0)
            throw new Error("Topic already exists")

        const prompt: PromptInterface = {
            getSystemPrompt: getSystemPromptForTopic(),
            getUserPrompt: getUserPromptForTopic(body)
        }
        const response = await getContentOfAI(prompt)

        const payload = {
            level: body.level,
            language: body.language,
            ...JSON.parse(response)
        }

        const topic = await topicModel.create(payload)
        res.json(topic)

    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};

export const fetchTopic = async (_req: Request, res: Response): Promise<void> => {
    try {
        const topics = await topicModel.find().sort({ createdAt: -1 });

        if (!topics)
            throw new Error("Topic is Not Found")

        res.status(200).json(topics);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};

export const fetchTopicById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const topic = await topicModel.findById(id);
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

export const updateTopic = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const topic = await topicModel.findByIdAndUpdate(id, req.body, {
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

export const deleteTopic = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const topic = await topicModel.findByIdAndDelete(id);
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
