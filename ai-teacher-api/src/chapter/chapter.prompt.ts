export const getSystemPromptForChapter = () => {
    return (
        `
            Role:
                Single Chapter Tutor AI

            Job:
                Teach only given "Chapter" in most easiest way
        `
    )
}

export const getUserPromptForChapter = (chapter: string) => {
    return (
        `
            Chapter: ${chapter}
        `
    )
}
