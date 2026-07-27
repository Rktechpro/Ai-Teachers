import { useMemo, useState } from "react";
import moment from "moment";
import {
  GraduationCap,
  Search,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({
  topics,
  activeTopic,
  setActiveTopic,
  loading,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
}) {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) =>
      (topic.name || topic.title || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, topics]);

  const getTopicId = (topic) => topic?._id || topic?.id;

  const capitalizeTopicName = (name) =>
    (name || "")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed right-4 top-4 z-40 rounded-xl bg-indigo-600 p-2 text-white shadow-lg lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static
        left-0 top-0
        z-50
        h-screen
        w-[280px] sm:w-72 lg:w-80
        flex flex-col
        border-r border-white/20
        bg-gradient-to-b
        from-indigo-500
        via-violet-500
        to-cyan-500
        p-4 md:p-5
        text-white
        shadow-2xl
        backdrop-blur-xl
        transition-transform
        duration-300

        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile Close */}
        <div className="mb-4 flex justify-end lg:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg bg-white/20 p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Logo */}
        <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-3">
              <GraduationCap className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-lg font-bold md:text-xl">AI Teacher</h1>

              <p className="text-sm text-white/80">Learn anything with AI</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="w-full rounded-xl border border-white/20 bg-white/15 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/60 outline-none backdrop-blur-xl focus:border-white/50 md:text-base"
          />
        </div>

        {/* Topics */}
        <div className="mt-5 flex-1 overflow-hidden">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">
            Chapters
          </h2>

          <div className="space-y-3">
            {loading && (
              <div className="rounded-xl bg-white/10 p-4 text-sm">
                Loading topics...
              </div>
            )}

            {filteredTopics.map((topic, index) => {
              const active = getTopicId(activeTopic) === getTopicId(topic);

              return (
                <div
                  key={getTopicId(topic) || index}
                  className={`group rounded-xl border p-3 transition-all duration-300 ${
                    active
                      ? "scale-[1.02] border-white/40 bg-white text-slate-900 shadow-xl"
                      : "border-white/10 bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => {
                        setActiveTopic(topic);
                        setSidebarOpen(false);
                      }}
                      className="flex flex-1 gap-3 text-left"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                          active
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-white/20"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-semibold md:text-base">
                          {capitalizeTopicName(topic.name || topic.title)}
                        </h3>

                        <div
                          className={`mt-2 flex items-center gap-1 text-xs ${
                            active ? "text-slate-500" : "text-white/70"
                          }`}
                        >
                          <CalendarDays size={13} />

                          {topic.createdAt
                            ? moment(topic.createdAt).format("DD MMM YYYY")
                            : "No date"}
                        </div>
                      </div>
                    </button>

                    <div className="flex gap-1">
                      <button
                        onClick={() => onEditTopic(topic)}
                        className={`rounded-lg p-2 ${
                          active
                            ? "text-indigo-600 hover:bg-indigo-50"
                            : "hover:bg-white/20"
                        }`}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => onDeleteTopic(topic)}
                        className={`rounded-lg p-2 ${
                          active
                            ? "text-red-500 hover:bg-red-50"
                            : "hover:bg-white/20"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {!loading && filteredTopics.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/30 p-6 text-center text-sm text-white/70">
                No topics found.
              </div>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={onAddTopic}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-indigo-600 shadow-xl transition hover:-translate-y-1"
        >
          <Plus size={18} />
          Add Topic
        </button>
      </aside>
    </>
  );
}
