import { useState } from "react";
import {
  X,
  BookOpen,
  GraduationCap,
  Languages,
  Plus,
  Pencil,
} from "lucide-react";
import { toast } from "react-toastify";
import { httpRequest } from "../lib/http-request";

const initialState = {
  topic: "",
  level: "",
  language: "",
};

const getInitialForm = (topic) => ({
  topic: topic?.name || topic?.title || "",
  level: topic?.level || "",
  language: topic?.language || "",
});

const getTopicId = (topic) => topic?._id || topic?.id;

export default function TopicModal({
  open,
  topic,
  onClose,
  onCreate,
  onUpdate,
}) {
  const [form, setForm] = useState(() => getInitialForm(topic));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(topic);

  if (!open) return null;

  const resetForm = () => {
    setForm(initialState);
    setErrors({});
    setSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    const err = {};

    if (!form.topic.trim())
      err.topic = "Topic is required.";

    if (!form.level)
      err.level = "Please select a level.";

    if (!form.language)
      err.language = "Please select a language.";

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();

    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    const topicPayload = {
      name: form.topic,
      level: form.level,
      language: form.language
    };

    try {
      setSubmitting(true);
      const topicId = getTopicId(topic);
      if (isEditing && !topicId) {
        toast.error("Unable to update topic. Missing topic id.");
        return;
      }

      const { data } = isEditing
        ? await httpRequest.put(`/topic/${topicId}`, topicPayload)
        : await httpRequest.post("/topic", topicPayload);
      const responseTopic = data?.topic || data?.data || data || {};
      const savedTopic = isEditing
        ? { ...topic, ...topicPayload, ...responseTopic }
        : { ...topicPayload, ...responseTopic };
      const normalizedTopic = {
        ...savedTopic,
        title: savedTopic.name || savedTopic.title,
      };

      if (isEditing) {
        onUpdate(normalizedTopic);
        toast.success("Topic updated successfully.");
      } else {
        onCreate(normalizedTopic);
        toast.success("Topic created successfully.");
      }
      resetForm();
      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        `Unable to ${isEditing ? "update" : "create"} topic. Please try again.`;

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-5">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-6 text-white">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/20 p-3">
                {isEditing ? <Pencil /> : <Plus />}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {isEditing ? "Edit Topic" : "Create Topic"}
                </h2>

                <p className="text-white/80 text-sm">
                  {isEditing
                    ? "Update this learning chapter."
                    : "Add a new learning chapter."}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="rounded-xl p-2 hover:bg-white/20"
            >
              <X />
            </button>

          </div>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* Topic */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BookOpen size={18} />
              Topic
            </label>

            <input
              type="text"
              name="topic"
              value={form.topic}
              onChange={handleChange}
              placeholder="Example: Introduction to AI"
              className={`w-full rounded-2xl border px-4 py-3 outline-none transition
              ${
                errors.topic
                  ? "border-red-500"
                  : "border-slate-300 focus:border-indigo-500"
              }`}
            />

            {errors.topic && (
              <p className="mt-2 text-sm text-red-500">
                {errors.topic}
              </p>
            )}
          </div>

          {/* Level */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <GraduationCap size={18} />
              Level
            </label>

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className={`w-full rounded-2xl border px-4 py-3 outline-none transition
              ${
                errors.level
                  ? "border-red-500"
                  : "border-slate-300 focus:border-indigo-500"
              }`}
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {errors.level && (
              <p className="mt-2 text-sm text-red-500">
                {errors.level}
              </p>
            )}
          </div>

          {/* Language */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Languages size={18} />
              Language
            </label>

            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className={`w-full rounded-2xl border px-4 py-3 outline-none transition
              ${
                errors.language
                  ? "border-red-500"
                  : "border-slate-300 focus:border-indigo-500"
              }`}
            >
              <option value="">Select language</option>
              <option value="english">English</option>
              <option value="hinglish">Hinglish</option>
            </select>

            {errors.language && (
              <p className="mt-2 text-sm text-red-500">
                {errors.language}
              </p>
            )}
          </div>

          {/* Buttons */}

          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 rounded-2xl border border-slate-300 py-3 font-semibold transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {submitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Topic"
                  : "Create Topic"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
