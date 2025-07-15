import { useEffect, useState, memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Sparkles,
  Brain,
  CloudSun,
  HeartPulse,
  TrendingUp,
  Star,
  Moon,
  Cloud,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const API_BASE_URL = "http://localhost:5001";

const moodColors = {
  Lucid: "#8b5cf6",
  Happy: "#10b981",
  Anxious: "#f59e0b",
  Scary: "#ef4444",
  Peaceful: "#06b6d4",
  Confused: "#f97316",
  Excited: "#ec4899",
  Sad: "#6b7280",
};

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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
        <p className="text-white font-medium">{label}</p>
        <p className="text-purple-400">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const Insights = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [load, setIsLoad] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    // Simulate loading or wait for real data
    const timer = setTimeout(() => setIsLoad(false), 2000);
    return () => clearTimeout(timer);
  }, []);


  const analyzeEntries = (entries) => {
    if (!entries || entries.length === 0) {
      return {
        moods: [],
        weeklyTrend: [],
        suggestions: ["Start journaling your dreams to see insights!"],
        tags: [],
        commonWords: [],
        stats: {
          totalDreams: 0,
          lucidDreams: 0,
          avgRecall: 0,
          streakDays: 0,
        },
      };
    }

    const moodCounts = {};
    let lucidCount = 0;
    const tagFrequency = {};
    const allWords = [];

    entries.forEach((entry) => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
      if (entry.isLucid) lucidCount++;
      if (Array.isArray(entry.tags)) {
        entry.tags.forEach((tag) => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
      }
      if (entry.content) {
        const words = entry.content
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((word) => word.length > 3);
        allWords.push(...words);
      }
    });

    const moods = Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / entries.length) * 100),
    }));

    const tags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));

    const today = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyTrend = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay()];
      const dayEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.createdAt);
        return entryDate.toDateString() === date.toDateString();
      });
      const lucidDayEntries = dayEntries.filter((entry) => entry.isLucid);
      weeklyTrend.push({
        day: dayName,
        dreams: dayEntries.length,
        lucid: lucidDayEntries.length,
      });
    }

    const wordFreq = {};
    allWords.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    const commonWords = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7)
      .map(([word]) => word);

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    let streakDays = 0;
    let currentDate = new Date();
    for (let entry of sortedEntries) {
      const entryDate = new Date(entry.createdAt);
      const diffDays = Math.floor(
        (currentDate - entryDate) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === streakDays) streakDays++;
      else break;
    }

    const suggestions = [];
    if (lucidCount > 0) {
      suggestions.push(
        `You've had ${lucidCount} lucid dreams! Consider trying meditation before sleep.`
      );
    }
    if (entries.length > 5) {
      suggestions.push(
        "Great consistency! Your dream recall is improving with regular journaling."
      );
    }
    if (moods.length > 0) {
      const topMood = moods.reduce((a, b) => (a.count > b.count ? a : b));
      suggestions.push(
        `Your most common dream mood is ${topMood.mood}. This appears in ${topMood.percentage}% of your dreams.`
      );
    }
    if (streakDays > 0) {
      suggestions.push(
        `You're on a ${streakDays}-day dream journaling streak! Keep it up!`
      );
    }

    const defaultSuggestions = [
      "Try journaling right after waking up for more vivid recall.",
      "Set a dream intention before sleep to increase lucid dreaming.",
      "Look for recurring patterns in your dreams.",
      "Practice reality checks during the day to improve lucid dreaming.",
    ];

    while (suggestions.length < 4) {
      const suggestion =
        defaultSuggestions[
          Math.floor(Math.random() * defaultSuggestions.length)
        ];
      if (!suggestions.includes(suggestion)) suggestions.push(suggestion);
    }

    return {
      moods,
      weeklyTrend,
      suggestions,
      tags,
      commonWords,
      stats: {
        totalDreams: entries.length,
        lucidDreams: lucidCount,
        avgRecall:
          entries.length > 0
            ? Math.round(
                (entries.filter((e) => e.content && e.content.length > 50)
                  .length /
                  entries.length) *
                  100
              )
            : 0,
        streakDays,
      },
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/journal`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data = await res.json();
        setEntries(data);
        setInsights(analyzeEntries(data));
      } catch (err) {
        console.error(err);
        setInsights(analyzeEntries([]));
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  if (load) return <Loader page="Insights"/>;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dream insights...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">
            Unable to load insights. Please try again.
          </p>
        </div>
      </div>
    );
  }
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-6 backdrop-blur-sm bg-black">
        <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-800/90 rounded-3xl overflow-hidden backdrop-blur-sm ">
          {/* Background Animation */}
          <div className="absolute inset-0 z-0">
            <AnimatedBackground />
          </div>

          {/* Content */}
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

          {/* Floating Animation Keyframes */}
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
      <div className="relative w-full max-w-7xl bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-800/90 rounded-3xl overflow-hidden backdrop-blur-sm mt-14">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0">
          <AnimatedBackground />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Dream Insights
            </h1>
            <p className="text-gray-300 text-lg">
              Discover patterns in your subconscious journey
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Dreams",
                value: insights.stats.totalDreams,
                icon: <Moon size={20} className="text-purple-400" />,
                color: "purple",
              },
              {
                label: "Lucid Dreams",
                value: insights.stats.lucidDreams,
                icon: <Star size={20} className="text-blue-400" />,
                color: "blue",
              },
              {
                label: "Avg Recall",
                value: `${insights.stats.avgRecall}%`,
                icon: <Activity size={20} className="text-green-400" />,
                color: "green",
              },
              {
                label: "Streak Days",
                value: insights.stats.streakDays,
                icon: <TrendingUp size={20} className="text-pink-400" />,
                color: "pink",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-${stat.color}-400/30 transition-all duration-500`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 bg-${stat.color}-500/20 rounded-full flex items-center justify-center`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Mood Distribution */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                  <HeartPulse className="text-purple-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Mood Distribution
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Emotional patterns in your dreams
                  </p>
                </div>
              </div>
              {insights.moods.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={insights.moods}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="mood"
                      stroke="#9CA3AF"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {insights.moods.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={moodColors[entry.mood] || "#8b5cf6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-280 flex items-center justify-center text-gray-400">
                  <p>
                    No mood data available yet. Start journaling to see
                    patterns!
                  </p>
                </div>
              )}
            </div>

            {/* Weekly Trends */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-400/30 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                  <TrendingUp className="text-blue-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Weekly Trends
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Dream activity over the past week
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={insights.weeklyTrend}>
                  <XAxis
                    dataKey="day"
                    stroke="#9CA3AF"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="dreams"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Total Dreams"
                  />
                  <Line
                    type="monotone"
                    dataKey="lucid"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Lucid Dreams"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Dream Symbols */}
            <div className="bg-black backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                  <CloudSun className="text-cyan-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Dream Symbols
                  </h2>
                  <p className="text-gray-400 text-sm">Most frequent tags</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {insights.tags.length > 0 ? (
                  insights.tags.map(({ tag, count }, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                    >
                      <span className="text-white font-medium">#{tag}</span>
                      <span className="text-gray-400 text-sm">×{count}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-400 py-8">
                    <p>No tags found yet.</p>
                    <p className="text-sm">
                      Add more dream entries to see patterns!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-green-400/30 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                  <Brain className="text-green-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    AI Insights
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Personalized recommendations
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {insights.suggestions.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-3 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Keyframes */}
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
  );
};

export default Insights;
