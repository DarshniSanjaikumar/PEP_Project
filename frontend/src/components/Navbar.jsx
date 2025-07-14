import React, { useState } from "react";
import { User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md font-bold">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center justify-start w-1/3">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">D</span>
            </div>
            <span className="ml-2 text-white font-semibold text-lg">
              Dreamscape
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center justify-center w-1/3 font-bold">
          <div className="flex items-center space-x-8 bg-transparent backdrop-blur-md border border-white/10 px-10 py-2 rounded-full">
            <Link to="/" className="text-white hover:text-purple-300 transition-colors duration-300">
              Home
            </Link>
            <Link to="/journal" className="text-gray-300 hover:text-purple-300 transition-colors duration-300">
              Journal
            </Link>
            <Link to="/insights" className="text-gray-300 hover:text-purple-300 transition-colors duration-300">
              Insights
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-purple-300 transition-colors duration-300">
              About
            </Link>
          </div>
        </div>

        {/* Right: Auth buttons */}
        <div className="hidden md:flex items-center justify-end w-1/3 space-x-4">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-300 text-sm">Protection</span>
          </div>
          <Link
            to="/signup"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
          >
            <User size={20} />
            <span>Create Account</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white absolute right-6"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 border-t border-white/10">
          <div className="flex flex-col space-y-4 mt-4">
            <Link to="/" className="text-white hover:text-purple-300 transition-colors duration-300">
              Home
            </Link>
            <Link to="/journal" className="text-gray-300 hover:text-purple-300 transition-colors duration-300">
              Journal
            </Link>
            <Link to="/insights" className="text-gray-300 hover:text-purple-300 transition-colors duration-300">
              Insights
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-purple-300 transition-colors duration-300">
              About
            </Link>
            <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
              <User size={20} className="text-gray-300" />
              <Link
                to="/signup"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
