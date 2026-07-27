import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopicModal from "./components/TopicModal";
import LearningPage from "./components/LearningPage";
import { ToastContainer, toast } from "react-toastify";
import { httpRequest } from "./lib/http-request";

const normalizeTopic = (topic) => ({
  ...topic,
  id: topic.id || topic._id,
  title: topic.name || topic.title,
  duration: topic.duration || "8 mins",
  content:
    topic.content ||
    topic.description ||
    "No learning content has been added for this topic yet.",
});

const getTopicId = (topic) => topic?._id || topic?.id;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

export default function App() {
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoadingTopics(true);
        const { data } = await httpRequest.get("/topic");
        const topicList = data?.topics || data?.data || data || [];
        const normalizedTopics = Array.isArray(topicList)
          ? topicList.map(normalizeTopic)
          : [];

        setTopics(normalizedTopics);
        setActiveTopic((current) => {
          if (!normalizedTopics.length) return null;

          const currentId = getTopicId(current);
          return (
            normalizedTopics.find(
              (topic) => getTopicId(topic) === currentId
            ) || normalizedTopics[0]
          );
        });
      } catch (error) {
        toast.error(
          getErrorMessage(error, "Unable to fetch topics.")
        );
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  const closeTopicModal = () => {
    setOpenModal(false);
    setEditingTopic(null);
  };

  const handleAddTopic = () => {
    setEditingTopic(null);
    setOpenModal(true);
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setOpenModal(true);
  };

  const handleCreateTopic = (newTopic) => {
    const normalizedTopic = normalizeTopic(newTopic);

    setTopics((prev) => [...prev, normalizedTopic]);
    setActiveTopic(normalizedTopic);
  };

  const handleUpdateTopic = (updatedTopic) => {
    const normalizedTopic = normalizeTopic(updatedTopic);
    const updatedId = getTopicId(normalizedTopic);

    setTopics((prev) =>
      prev.map((topic) =>
        getTopicId(topic) === updatedId
          ? normalizeTopic({ ...topic, ...normalizedTopic })
          : topic
      )
    );
    setActiveTopic((current) =>
      getTopicId(current) === updatedId
        ? normalizeTopic({ ...current, ...normalizedTopic })
        : current
    );
  };

  const handleDeleteTopic = async (topic) => {
    const topicId = getTopicId(topic);

    if (!topicId) {
      toast.error("Unable to delete topic. Missing topic id.");
      return;
    }

    try {
      await httpRequest.delete(`/topic/${topicId}`);

      setTopics((prev) => {
        const nextTopics = prev.filter(
          (item) => getTopicId(item) !== topicId
        );

        setActiveTopic((current) => {
          if (getTopicId(current) !== topicId) return current;
          return nextTopics[0] || null;
        });

        return nextTopics;
      });
      toast.success("Topic deleted successfully.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to delete topic.")
      );
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-slate-100">
      {/* Background Blur Effects */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-indigo-400/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]" />
      <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-400/20 blur-[120px]" />

      <div className="relative flex h-full">
        {/* Sidebar */}
        <Sidebar
          topics={topics}
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          loading={loadingTopics}
          onAddTopic={handleAddTopic}
          onEditTopic={handleEditTopic}
          onDeleteTopic={handleDeleteTopic}
        />

        {/* Learning Area */}
        <main className="flex-1 overflow-hidden">
          <LearningPage
            topic={activeTopic}
            topics={topics}
            setActiveTopic={setActiveTopic}
          />
        </main>
      </div>

      {/* Add Topic Modal */}
      <TopicModal
        key={editingTopic ? getTopicId(editingTopic) : "create-topic"}
        open={openModal}
        topic={editingTopic}
        onClose={closeTopicModal}
        onCreate={handleCreateTopic}
        onUpdate={handleUpdateTopic}
      />
      <ToastContainer />
    </div>
  );
}
