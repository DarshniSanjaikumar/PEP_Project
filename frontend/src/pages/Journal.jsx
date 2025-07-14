import React, { useState, useEffect } from 'react';
import { BookText, PlusCircle, LineChart, Star, Moon, Cloud, Calendar, Search, Filter, X, Tags, Smile, Edit3 } from "lucide-react";

// JournalForm Component
const JournalForm = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [dream, setDream] = useState("");
  const [tags, setTags] = useState("");
  const [mood, setMood] = useState("Euphoric");

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      title,
      dream,
      tags: tags.split(",").map((t) => t.trim()).filter(t => t),
      mood,
      date: new Date().toISOString().split("T")[0],
      preview: dream.length > 100 ? dream.substring(0, 100) + "..." : dream
    };
    
    if (onSave) {
      onSave(entry);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 rounded-3xl border border-purple-500/20 p-8 w-full max-w-2xl mx-auto shadow-2xl shadow-purple-800/20 animate-fadeIn modal-scroll">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
        >
          <X size={24} />
        </button>

        {/* Form Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
            New Dream Entry
          </h2>
          <p className="text-gray-400">
            Write down your dream while it's still vivid.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Title */}
          <div className="relative">
            <Edit3 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dream title..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700/40 border border-gray-600/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 outline-none transition-all duration-200"
            />
          </div>

          {/* Description */}
          <textarea
            required
            rows={4}
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="What did you see, feel, or do?"
            className="w-full px-4 py-4 rounded-2xl bg-gray-700/40 border border-gray-600/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 outline-none resize-none transition-all duration-200"
          />

          {/* Tags */}
          <div className="relative">
            <Tags className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="flying, forest, peace (separate with commas)"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700/40 border border-gray-600/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 outline-none transition-all duration-200"
            />
          </div>

          {/* Mood Selector */}
          <div className="relative">
            <Smile className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700/40 border border-gray-600/30 text-white focus:ring-2 focus:ring-purple-500/40 outline-none appearance-none transition-all duration-200"
            >
              <option value="Euphoric">Euphoric</option>
              <option value="Peaceful">Peaceful</option>
              <option value="Nostalgic">Nostalgic</option>
              <option value="Anxious">Anxious</option>
              <option value="Confused">Confused</option>
              <option value="Terrified">Terrified</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!title || !dream}
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold shadow-md shadow-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
          >
            Save Dream Entry
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Journal Component
const Journal = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('recent');
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "2024-01-15",
      title: "Flying Over Mountains",
      preview: "I found myself soaring above snow-capped peaks, feeling completely free and weightless...",
      mood: "Euphoric",
      tags: ["flying", "nature", "freedom"]
    },
    {
      id: 2,
      date: "2024-01-14",
      title: "Childhood Home",
      preview: "I was back in my grandmother's house, everything felt so vivid and familiar...",
      mood: "Nostalgic",
      tags: ["family", "childhood", "home"]
    },
    {
      id: 3,
      date: "2024-01-13",
      title: "Ocean Adventure",
      preview: "Swimming with dolphins in crystal clear waters, breathing underwater like it was natural...",
      mood: "Peaceful",
      tags: ["ocean", "animals", "underwater"]
    }
  ]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const floatingElements = [
    { id: 1, icon: Star, size: 16, delay: 0, duration: 6000 },
    { id: 2, icon: Moon, size: 20, delay: 1000, duration: 8000 },
    { id: 3, icon: Cloud, size: 24, delay: 2000, duration: 7000 },
    { id: 4, icon: Star, size: 14, delay: 3000, duration: 9000 },
    { id: 5, icon: Moon, size: 18, delay: 4000, duration: 5000 },
    { id: 6, icon: Cloud, size: 22, delay: 5000, duration: 6500 },
    { id: 7, icon: Star, size: 12, delay: 6000, duration: 7500 },
    { id: 8, icon: Moon, size: 16, delay: 7000, duration: 8500 },
  ];

  const handleNewEntry = () => {
    setShowJournalForm(true);
  };

  const handleSaveEntry = (newEntry) => {
    setEntries(prev => [newEntry, ...prev]);
  };

  const handleTrackInsights = () => {
    // Navigate to insights page
    console.log('Navigate to insights');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(219,39,119,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>

        {/* Floating particles */}
        {floatingElements.map((element) => {
          const Icon = element.icon;
          return (
            <div
              key={element.id}
              className="absolute opacity-90 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${element.delay}ms`,
                animationDuration: `${element.duration}ms`,
                transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.02}px)`,
              }}
            >
              <Icon size={element.size} className="text-purple-300/30" />
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-400/30">
              <BookText size={32} className="text-purple-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Dream Journal
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Record your dreams and discover patterns in your subconscious mind. 
              Every dream is a doorway to understanding yourself better.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            <button 
              onClick={handleNewEntry}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
            >
              <PlusCircle size={20} />
              New Dream Entry
            </button>
            <button 
              onClick={handleTrackInsights}
              className="flex items-center gap-3 px-8 py-4 bg-gray-800/30 backdrop-blur-sm border border-gray-600/50 text-white rounded-full font-medium hover:bg-gray-700/40 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20 hover:scale-105"
            >
              <LineChart size={20} />
              Track Insights
            </button>
          </div>

          {/* Journal Container */}
          <div className="relative bg-gray-800/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-700/50">
            {/* Content */}
            <div className="relative z-10 p-8">
              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                <div className="flex bg-gray-600/40 backdrop-blur-sm rounded-full p-2 border border-gray-500/30">
                  {['recent', 'search'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-full font-medium transition-all duration-300 capitalize ${
                        activeTab === tab 
                          ? 'bg-purple-500 text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab === 'recent' && <Calendar size={16} className="inline mr-2" />}
                      {tab === 'search' && <Search size={16} className="inline mr-2" />}
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              {activeTab === 'search' && (
                <div className="mb-8">
                  <div className="relative max-w-md mx-auto">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search your dreams..."
                      className="w-full pl-12 pr-12 py-4 bg-gray-600/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                    />
                    <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300">
                      <Filter size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Dream Entries */}
              {activeTab === 'recent' && (
                <div className="space-y-6">
                  {entries.length > 0 ? (
                    entries.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          opacity: 0,
                          animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                              {entry.title}
                            </h3>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <Calendar size={14} />
                              {entry.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                              {entry.mood}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {entry.preview}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-600/40 text-gray-400 text-xs rounded-full border border-gray-500/30"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-600/40 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookText size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">No Dreams Yet</h3>
                      <p className="text-gray-400 mb-6">
                        Start your journey by recording your first dream entry.
                      </p>
                      <button 
                        onClick={handleNewEntry}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
                      >
                        Create First Entry
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Search Results */}
              {activeTab === 'search' && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-600/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Search Your Dreams</h3>
                  <p className="text-gray-400">
                    Enter keywords to find specific dreams, themes, or emotions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Journal Form Popup */}
      {showJournalForm && (
        <JournalForm 
          onClose={() => setShowJournalForm(false)} 
          onSave={handleSaveEntry}
        />
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .modal-scroll {
          max-height: 90vh;
          overflow-y: auto;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Journal;