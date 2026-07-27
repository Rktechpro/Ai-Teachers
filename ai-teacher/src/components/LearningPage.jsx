import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  GraduationCap,
  Languages,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { markdownComponents } from "./MarkdownComponents";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {httpRequest} from '../lib/http-request'

export function toMarkdownNumberedList(items) {
  return [
    ...items.map((item, index) => `${index + 1}. ${item.trim()}`),
    "",
    "---",
    "",
    "**Start learning by clicking on the Next button.**"
  ].join("\n");
}

export default function LearningPage({
  topic,
  topics,
  setActiveTopic,
}) {
  const getTopicId = (item) => item?._id || item?.id;
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [chapterContent, setChapterContent] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(()=>{
    setCurrentChapterIndex(0)
    setChapterContent(null)
  }, [topic])

  const getChapter = async (button, item)=>{
    try {
      setLoading(true)
      let index = currentChapterIndex
      const size = item.chapters.length

      const name = item.chapters[index]
      const {data} = await httpRequest.post("/chapter", {name, topic: item._id})
      setChapterContent(data.content)

      if(button === "NEXT")
      {
        if(index >= size - 1) return
        index++
      }

      if(button === "PREV")
      {
        if(index <= 0) return
        index--
      }

      setCurrentChapterIndex(index)
    }
    catch(err)
    {
      toast.error(err.message)
    }
    finally {
      setLoading(false)
    }
  }

  if (!topic) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-indigo-500" />
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome to AI Teacher
          </h2>
          <p className="mt-2 text-slate-500">
            Select a topic from the sidebar to begin learning.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = topics.findIndex(
    (t) => getTopicId(t) === getTopicId(topic)
  );

  const previousTopic =
    currentIndex > 0 ? topics[currentIndex - 1] : null;

  const nextTopic =
    currentIndex < topics.length - 1
      ? topics[currentIndex + 1]
      : null;

  if(isLoading)
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-slate-50 py-16">

      {/* Scrollable Area */}

      <div className="flex-1 overflow-y-auto">

        <div className="mx-auto max-w-5xl p-8 bg-white rounded-4xl shadow-lg">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-24 h-24 text-gray-300" />
            <h1 className="text-4xl font-bold text-black/30">Generating</h1>
          </div>
        </div>
      </div>

      </div>
    )

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">

      {/* Scrollable Area */}

      <div className="flex-1 overflow-y-auto">

        <div className="mx-auto max-w-5xl p-8">

          {/* Hero */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-8 text-white shadow-2xl">

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">

              <div className="mb-6 inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Powered Learning
              </div>

              <h1 className="text-5xl font-extrabold leading-tight capitalize">
                {topic.name}
              </h1>

              <p className="mt-4 max-w-3xl text-lg text-white/90">
                {topic.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <div className="capitalize  flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                  <GraduationCap size={18} />
                  {topic.level}
                </div>

                <div className="capitalize flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                  <Languages size={18} />
                  {topic.language}
                </div>

              </div>

            </div>

          </div>

          {/* Markdown */}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {chapterContent ?  chapterContent : toMarkdownNumberedList(topic.chapters)}
            </ReactMarkdown>

          </div>

        </div>

      </div>

      {/* Bottom Navigation */}

      <div className="border-t border-slate-200 bg-white/80 p-5 backdrop-blur-xl">

        <div className="mx-auto flex max-w-5xl gap-4">

          <button
            onClick={()=>getChapter('PREV', topic)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:-translate-y-1`}>
            <ChevronLeft />
            Previous Chapter
          </button>

          <button
            onClick={()=>getChapter('NEXT', topic)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition-all duration-300 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg hover:-translate-y-1`}>
            Next Chapter
            <ChevronRight />
          </button>

        </div>

      </div>

    </div>
  );
}
