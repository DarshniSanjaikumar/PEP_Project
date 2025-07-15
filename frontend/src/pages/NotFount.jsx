import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cloud, Star, Moon, ArrowLeft } from "lucide-react";
import Lottie from "lottie-react";
import error from "../assets/lottie/404.json"
const NotFound = () => {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const floatingIcons = [
    { id: 1, icon: Star, size: 18, delay: 0 },
    { id: 2, icon: Moon, size: 22, delay: 500 },
    { id: 3, icon: Cloud, size: 20, delay: 1000 },
    { id: 4, icon: Star, size: 16, delay: 1500 },
    { id: 5, icon: Cloud, size: 24, delay: 2000 },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.08),transparent_50%)]"></div>
        <div
          className="absolute w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"
          style={{
            top: "20%",
            left: "10%",
            transform: `translate(${mouse.x * 0.01}px, ${mouse.y * 0.01}px)`,
            transition: "transform 0.3s ease",
          }}
        />
        <div
          className="absolute w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"
          style={{
            bottom: "15%",
            right: "15%",
            transform: `translate(${mouse.x * -0.015}px, ${mouse.y * -0.015}px)`,
            transition: "transform 0.3s ease",
          }}
        />
      </div>

      {/* Floating icons */}
      {floatingIcons.map(({ id, icon: Icon, size, delay }) => (
        <div
          key={id}
          className="absolute animate-float opacity-20"
          style={{
            left: `${10 + id * 15}%`,
            top: `${10 + (id % 3) * 20}%`,
            animationDelay: `${delay}ms`,
          }}
        >
          <Icon size={size} className="text-purple-300/30" />
        </div>
      ))}

      {/* Center content */}
      <div className="relative z-10 text-center px-6 max-w-xl">
        {/* Lottie Animation */}
        <div className="w-64 mx-auto mb-4">
          <Lottie animationData={error} loop={true} />
        </div>

        <p className="text-gray-300 text-lg mb-6">
          Oops! The dream you're chasing doesn't exist. Try floating back to reality.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft size={16} />
          <span>Return to DreamScape</span>
        </button>
      </div>

      {/* Float animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;