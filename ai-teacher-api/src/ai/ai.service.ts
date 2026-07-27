import dotenv from 'dotenv'
import Groq from "groq-sdk";
dotenv.config()

const ai = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

export interface PromptInterface {
    getSystemPrompt: string,
    getUserPrompt: string
}

export const getContentOfAI = async (data: PromptInterface) => {
    const result = await ai.chat.completions.create({
        model: process.env.GEMINI_MODEL_NAME!,
        temperature: 0,
        messages: [
            { role: 'system', content: data.getSystemPrompt },
            { role: 'user', content: data.getUserPrompt }
        ]
    })

    const response = result.choices[0].message.content

    if (!response || response === "null")
        throw new Error("Invalid topic")

    return response

}