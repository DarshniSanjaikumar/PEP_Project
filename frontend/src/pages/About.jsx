import React, { useState, useEffect }from "react";
import { Sparkles, Brain, Heart, Rocket } from "lucide-react";
import Loader from "../components/Loader";
// Simple celestial background component
const CelestialBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
    <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-pulse delay-300"></div>
    <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-70 animate-pulse delay-500"></div>
    <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-pulse delay-700"></div>
    <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-purple-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
  </div>
);

const aboutCards = [
  {
    icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    title: "What is DreamScape",
    description:
      "DreamScape is a dream journaling platform that helps you to  document, reflect, and understand your dreams. You can write entries, track dream moods, and begin to uncover recurring patterns.",
  },
  {
    icon: <Brain className="w-8 h-8 text-pink-400" />,
    title: "Why We Exist",
    description:
      "Dreams often carry emotions, thoughts, and signals we overlook. DreamScape exists to create a quiet space where users can reflect, release, and reconnect with their subconscious through dreams.",
  },
  {
    icon: <Heart className="w-8 h-8 text-purple-300" />,
    title: "How It Helps You",
    description:
      "DreamScape allows you to express your thoughts, track emotional patterns in dreams, and gain mental clarity. It's a step toward self-awareness, healing, and creative exploration.",
  },
  {
    icon: <Rocket className="w-8 h-8 text-pink-300" />,
    title: "What's Coming Next?",
    description:
      "We're working on bringing enhanced insights, visualization tools, and deeper dream tracking features. A more intuitive and insightful experience is on the horizon.",
  },
];

const About = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or wait for real data
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader page="About"/>;


  return (
    <div className="relative min-h-screen overflow-hidden py-20 px-6 flex items-center justify-center bg-black">
      <CelestialBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-80 backdrop-blur-md z-0 rounded-2xl" />

      <div className="relative z-10 max-w-6xl text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          About Dreamscape
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-12">
          A space for your dreams to rest, reflect, and reveal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 px-4">
          {aboutCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-white shadow-2xl hover:shadow-purple-400/20 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/10"
            >
              <div className="mb-4">{card.icon}</div>
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-400 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;