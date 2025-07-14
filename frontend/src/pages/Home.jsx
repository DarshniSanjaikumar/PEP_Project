import React, { useState, useEffect } from 'react';
import { ChevronDown, Play, ArrowRight, Star, Moon, Cloud } from 'lucide-react';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const cryptoData = [
    { name: 'Dreams', symbol: 'DRM', price: '∞', change: '+∞', dotColor: 'bg-green-400' },
    { name: 'Lucid', symbol: 'LUC', price: '12.45', change: '+8.23', dotColor: 'bg-orange-400' },
    { name: 'Visions', symbol: 'VIS', price: '9.87', change: '+15.67', dotColor: 'bg-blue-400' },
    { name: 'Nightmares', symbol: 'NMR', price: '3.21', change: '-2.11', dotColor: 'bg-red-400' },
  ];

  // Floating particles data
  const floatingElements = [
    { id: 1, icon: Star, size: 16, delay: 0, duration: 6000 },
    { id: 2, icon: Moon, size: 20, delay: 1000, duration: 8000 },
    { id: 3, icon: Cloud, size: 24, delay: 2000, duration: 7000 },
    { id: 4, icon: Star, size: 14, delay: 3000, duration: 9000 },
    { id: 5, icon: Moon, size: 18, delay: 4000, duration: 5000 },
    { id: 6, icon: Cloud, size: 22, delay: 5000, duration: 6500 },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 ">
      {/* Main Container - Rounded Box */}
      <div className="relative w-full max-w-8xl h-[850px] bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-800/90 rounded-3xl overflow-hidden backdrop-blur-sm mt-5">
        
        {/* Animated Background - Contained within rounded box */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 rounded-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] rounded-3xl"></div>
          
          {/* Enhanced Floating Elements */}
          <div 
            className="absolute top-16 left-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
            style={{
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          ></div>
          <div 
            className="absolute bottom-16 right-8 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"
            style={{
              transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
              transition: 'transform 0.6s ease-out'
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-500"
            style={{
              transform: `translate(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px)`,
              transition: 'transform 0.4s ease-out'
            }}
          ></div>
          
          {/* Additional dreamy floating orbs */}
          <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-cyan-500/8 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/3 left-1/4 w-36 h-36 bg-violet-500/8 rounded-full blur-2xl animate-pulse delay-3000"></div>
          <div className="absolute top-3/4 right-1/3 w-20 h-20 bg-indigo-500/8 rounded-full blur-xl animate-pulse delay-1500"></div>
        </div>

        {/* Floating Particles - Contained */}
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
                  transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.02}px)`,
                }}
              >
                <Icon size={element.size} className="text-purple-300/30" />
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full">
        {/* Floating Crypto Tickers - Four Corners */}
        {/* Top Left - Dreams */}
        <div 
          className="absolute top-12 left-12 transform transition-transform duration-700"
          style={{
            transform: `translateY(${scrollY * 0.05}px) translateX(${mousePosition.x * 0.003}px)`,
          }}
        >
          <div 
            className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:border-purple-400/30 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/10 animate-float"
            style={{
              animationDelay: '0ms',
              animationDuration: '4000ms'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${cryptoData[0].dotColor} rounded-full animate-pulse`}></div>
                <div>
                  <p className="text-white font-medium text-xs">{cryptoData[0].name}</p>
                  <p className="text-gray-400 text-xs">{cryptoData[0].symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium text-xs">{cryptoData[0].price}</p>
                <p className={`text-xs ${cryptoData[0].change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {cryptoData[0].change}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right - Lucid */}
        <div 
          className="absolute top-12 right-12 transform transition-transform duration-700"
          style={{
            transform: `translateY(${scrollY * -0.05}px) translateX(${mousePosition.x * -0.003}px)`,
          }}
        >
          <div 
            className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:border-blue-400/30 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/10 animate-float"
            style={{
              animationDelay: '500ms',
              animationDuration: '4500ms'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${cryptoData[1].dotColor} rounded-full animate-pulse`}></div>
                <div>
                  <p className="text-white font-medium text-xs">{cryptoData[1].name}</p>
                  <p className="text-gray-400 text-xs">{cryptoData[1].symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium text-xs">{cryptoData[1].price}</p>
                <p className={`text-xs ${cryptoData[1].change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {cryptoData[1].change}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left - Visions */}
        <div 
          className="absolute bottom-12 left-12 transform transition-transform duration-700"
          style={{
            transform: `translateY(${scrollY * 0.03}px) translateX(${mousePosition.x * 0.003}px)`,
          }}
        >
          <div 
            className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/10 animate-float"
            style={{
              animationDelay: '1000ms',
              animationDuration: '3800ms'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${cryptoData[2].dotColor} rounded-full animate-pulse`}></div>
                <div>
                  <p className="text-white font-medium text-xs">{cryptoData[2].name}</p>
                  <p className="text-gray-400 text-xs">{cryptoData[2].symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium text-xs">{cryptoData[2].price}</p>
                <p className={`text-xs ${cryptoData[2].change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {cryptoData[2].change}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right - Nightmares */}
        <div 
          className="absolute bottom-12 right-12 transform transition-transform duration-700"
          style={{
            transform: `translateY(${scrollY * -0.03}px) translateX(${mousePosition.x * -0.003}px)`,
          }}
        >
          <div 
            className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:border-red-400/30 transition-all duration-500 hover:shadow-lg hover:shadow-red-500/10 animate-float"
            style={{
              animationDelay: '1500ms',
              animationDuration: '4200ms'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${cryptoData[3].dotColor} rounded-full animate-pulse`}></div>
                <div>
                  <p className="text-white font-medium text-xs">{cryptoData[3].name}</p>
                  <p className="text-gray-400 text-xs">{cryptoData[3].symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium text-xs">{cryptoData[3].price}</p>
                <p className={`text-xs ${cryptoData[3].change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {cryptoData[3].change}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center h-full px-6">
          {/* Central Video Play Button */}
          <div 
            className="mb-6"
            style={{
              transform: `translateY(${scrollY * 0.02}px)`,
            }}
          >
            <button className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 group">
              <Play size={24} className="text-white ml-1 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Unlock Assets Button */}
          <div 
            className="mb-8"
            style={{
              transform: `translateY(${scrollY * -0.02}px)`,
            }}
          >
            <button className="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-black font-bold text-xs">D</span>
              </div>
              <span className="text-white">Unlock Your Dreams</span>
              <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-4xl md:text-5xl font-bold text-center mb-4 leading-tight"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          >
            Dream{''}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              Scape
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-gray-300 text-base md:text-lg text-center max-w-2xl mb-8"
            style={{
              transform: `translateY(${scrollY * -0.03}px)`,
            }}
          >
            Dive into the art of dreams, where innovative consciousness technology meets personal exploration
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4"
            style={{
              transform: `translateY(${scrollY * 0.01}px)`,
            }}
          >
            <button className="group flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-white/20 hover:scale-105">
              <span>Open Journal</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105">
              Discover More
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;