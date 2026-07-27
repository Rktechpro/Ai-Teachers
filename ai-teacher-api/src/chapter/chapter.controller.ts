import { Request, Response } from "express";
import { chapterModel } from "./chapter.model";
import { getContentOfAI, PromptInterface } from "../ai/ai.service";
import { getSystemPromptForChapter, getUserPromptForChapter } from "./chapter.prompt";


export const createChapter = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body
        const oldChapter = await chapterModel.findOne({ name: body.name.toLowerCase(), topic: body.topic }).populate('topic')

        if (oldChapter) {
            res.json(oldChapter)
            return
        }

        const prompt: PromptInterface = {
            getSystemPrompt: getSystemPromptForChapter(),
            getUserPrompt: getUserPromptForChapter(body.name)
        }

        const respose = await getContentOfAI(prompt)
        const payload = {
            name: body.name,
            topic: body.topic,
            content: respose
        }

        const chapter = await chapterModel.create(payload)
        await chapter.populate({ path: 'topic' })

        res.status(201).json(chapter);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};

export const fetchChapter = async (_req: Request, res: Response): Promise<void> => {
    try {
        const chapters = await chapterModel.find().sort({ createdAt: -1 }).populate("topic");

        res.status(200).json(chapters);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
};

export const fetchChapterByTopicId = async (req: Request, res: Response): Promise<void> => {
    try {
        const topic = { topic: req.params.topicId };
        const chapter = await chapterModel.find(topic)
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

export const updateChapter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const chapter = await chapterModel.findByIdAndUpdate(id, req.body, {
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

export const deleteChapter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const chapter = await chapterModel.findByIdAndDelete(id);
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
