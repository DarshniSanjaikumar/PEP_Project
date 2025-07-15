import React, { useState, useEffect, memo } from "react";
import {
  BookText,
  PlusCircle,
  LineChart,
  Star,
  Calendar,
  Search,
  X,
  Tags,
  Smile,
  Edit3,
  Moon,
  Cloud,
  Sparkles,
  Edit,
  Trash2,
  MoreHorizontal,
  Save,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const API_BASE_URL = "http://localhost:5001";

const highlightMatch = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-purple-500/30 text-purple-300 px-1 rounded-sm"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const JournalForm = ({ onClose, onSave, editingEntry = null }) => {
  const [title, setTitle] = useState(editingEntry?.title || "");
  const [dream, setDream] = useState(editingEntry?.dream || "");
  const [tags, setTags] = useState(editingEntry?.tags?.join(", ") || "");
  const [mood, setMood] = useState(editingEntry?.mood || "Euphoric");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const entryData = {
      title,
      dream,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      mood,
    };

    try {
      let res;
      if (editingEntry) {
        // Update existing entry
        res = await fetch(`${API_BASE_URL}/journal/${editingEntry._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(entryData),
        });
      } else {
        // Create new entry
        res = await fetch(`${API_BASE_URL}/journal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(entryData),
        });
      }

      if (!res.ok)
        throw new Error(`Failed to ${editingEntry ? "update" : "save"} entry`);
      const data = await res.json();
      onSave(data.entry, editingEntry ? "update" : "create");
      onClose();
    } catch (err) {
      console.error(
        `Error ${editingEntry ? "updating" : "saving"} entry:`,
        err
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 rounded-3xl border border-purple-500/20 p-8 w-full max-w-2xl mx-auto shadow-2xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            {editingEntry ? "Edit Dream Entry" : "New Dream Entry"}
          </h2>
          <p className="text-gray-400 mt-1">
            {editingEntry
              ? "Update your dream details."
              : "Write down your dream while it's still vivid."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Edit3
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dream title..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700/40 border border-gray-600/30 text-white placeholder-gray-400"
            />
          </div>

          <textarea
            required
            rows={4}
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="What did you see, feel, or do?"
            className="w-full px-4 py-4 rounded-2xl bg-gray-700/40 border border-gray-600/30 text-white placeholder-gray-400 resize-none"
          />

          <div className="relative">
            <Tags
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="flying, forest, peace"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700/40 border border-gray-600/30 text-white placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <Smile
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700/40 border border-gray-600/30 text-white"
            >
              <option value="Euphoric">Euphoric</option>
              <option value="Peaceful">Peaceful</option>
              <option value="Nostalgic">Nostalgic</option>
              <option value="Anxious">Anxious</option>
              <option value="Confused">Confused</option>
              <option value="Terrified">Terrified</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                {editingEntry ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {editingEntry ? "Update Dream Entry" : "Save Dream Entry"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ entry, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 rounded-3xl p-8 w-full max-w-md mx-auto shadow-2xl animate-fadeIn">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Delete Dream Entry
          </h3>
          <p className="text-gray-400">
            Are you sure you want to delete "{entry.title}"?
          </p>
          <p className="text-red-400 text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-gray-700/40 border border-gray-600/30 text-white hover:bg-gray-600/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const EntryActionsMenu = ({ entry, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
      >
        <MoreHorizontal size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-xl border border-gray-700 shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => {
                onEdit(entry);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <Edit size={16} className="text-blue-400" />
              Edit Entry
            </button>
            <button
              onClick={() => {
                onDelete(entry);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <Trash2 size={16} className="text-red-400" />
              Delete Entry
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [activeTab, setActiveTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchEntries = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/journal`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data = await res.json();
        setEntries(data);
        setFilteredEntries(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchEntries();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEntries(entries);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredEntries(
        entries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(q) ||
            entry.dream.toLowerCase().includes(q) ||
            entry.tags.some((tag) => tag.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, entries]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Simulate loading or wait for real data
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loader page="Journal"/>;

  const AnimatedBackground = memo(() => {
    const floatingElements = [
      { id: 1, icon: Star, size: 14, delay: 0, duration: 6000 },
      { id: 2, icon: Moon, size: 18, delay: 1000, duration: 8000 },
      { id: 3, icon: Cloud, size: 20, delay: 2000, duration: 7000 },
      { id: 4, icon: Sparkles, size: 16, delay: 3000, duration: 5000 },
    ];

    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 rounded-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] rounded-3xl" />

        <div className="absolute top-16 left-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-16 right-8 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-500" />

        <div className="absolute inset-0 z-5 pointer-events-none">
          {floatingElements.map((element) => {
            const Icon = element.icon;
            return (
              <div
                key={element.id}
                className="absolute opacity-20 animate-float"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                  animationDelay: `${element.delay}ms`,
                  animationDuration: `${element.duration}ms`,
                }}
              >
                <Icon size={element.size} className="text-purple-300/30" />
              </div>
            );
          })}
        </div>
      </>
    );
  });

  const handleSaveEntry = (entry, action) => {
    if (action === "update") {
      setEntries((prev) => prev.map((e) => (e._id === entry._id ? entry : e)));
      setFilteredEntries((prev) =>
        prev.map((e) => (e._id === entry._id ? entry : e))
      );
    } else {
      setEntries((prev) => [entry, ...prev]);
      setFilteredEntries((prev) => [entry, ...prev]);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowJournalForm(true);
  };

  const handleDeleteEntry = async (entry) => {
    try {
      const res = await fetch(`${API_BASE_URL}/journal/${entry._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete entry");

      setEntries((prev) => prev.filter((e) => e._id !== entry._id));
      setFilteredEntries((prev) => prev.filter((e) => e._id !== entry._id));
      setDeleteEntry(null);
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  const handleFormClose = () => {
    setShowJournalForm(false);
    setEditingEntry(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-6 backdrop-blur-sm bg-black">
        <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-800/90 rounded-3xl overflow-hidden backdrop-blur-sm ">
          <div className="absolute inset-0 z-0">
            <AnimatedBackground />
          </div>

          <div className="relative z-10 p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-purple-400/30 backdrop-blur-sm">
              <Star className="text-purple-400" size={32} />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-white leading-tight">
                Please log in
              </h1>
              <p className="text-gray-300 text-lg">
                Sign in to access your dreams and insights.
              </p>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-purple-400/30 shadow-lg"
            >
              Login
            </button>
          </div>

          <style jsx>{`
            @keyframes float {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-20px);
              }
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="relative w-full max-w-7xl bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-800/90 rounded-3xl overflow-hidden backdrop-blur-sm mt-14 min-h-screen">
        <div className="absolute inset-0 z-0">
          <AnimatedBackground />
        </div>

        <div className="relative z-10 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-400/30 backdrop-blur-sm">
              <BookText size={32} className="text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Dream Journal
            </h1>
            <p className="text-gray-300 text-lg">
              Record your dreams and discover patterns in your subconscious.
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={() => setShowJournalForm(true)}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-purple-400/30"
            >
              <PlusCircle size={20} />
              New Entry
            </button>
            <button
              onClick={() => navigate("/insights")}
              className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white rounded-2xl border border-white/10 hover:scale-105 hover:border-purple-400/30 transition-all duration-300 backdrop-blur-sm"
            >
              <LineChart size={20} />
              Track Insights
            </button>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-1">
              {["recent", "search"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab === "recent" ? (
                    <Calendar size={16} className="inline mr-2" />
                  ) : (
                    <Search size={16} className="inline mr-2" />
                  )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "search" && (
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, tags, or content..."
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300"
                />
                <Search
                  size={20}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-6">
            {(activeTab === "recent" ? entries : filteredEntries).length > 0 ? (
              (activeTab === "recent" ? entries : filteredEntries).map(
                (entry) => (
                  <div
                    key={entry._id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all duration-500"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {highlightMatch(entry.title, searchQuery)}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-400/30">
                          {entry.mood}
                        </span>
                        <EntryActionsMenu
                          entry={entry}
                          onEdit={handleEditEntry}
                          onDelete={setDeleteEntry}
                        />
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                      {highlightMatch(entry.dream, searchQuery)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10 hover:border-purple-400/30 transition-all duration-300"
                        >
                          #{highlightMatch(tag, searchQuery)}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookText size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">
                  {activeTab === "search"
                    ? "No matching entries found."
                    : "You haven't added any dream entries yet."}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {activeTab === "search"
                    ? "Try adjusting your search terms or add more dream entries."
                    : "Click on 'New Entry' to start your dream journaling journey."}
                </p>
              </div>
            )}
          </div>
        </div>

        {showJournalForm && (
          <JournalForm
            onClose={handleFormClose}
            onSave={handleSaveEntry}
            editingEntry={editingEntry}
          />
        )}

        {deleteEntry && (
          <DeleteConfirmModal
            entry={deleteEntry}
            onClose={() => setDeleteEntry(null)}
            onConfirm={() => handleDeleteEntry(deleteEntry)}
          />
        )}

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Journal;
