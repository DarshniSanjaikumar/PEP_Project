import React, { useState, useEffect, useRef } from "react";
import { User, Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import moonAnimation from "../assets/lottie/logo_another.json";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const res = await fetch("http://localhost:5001/api/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.userName);
        } else {
          setUserName("");
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setUserName("");
      }
    } else {
      setUserName("");
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("loginStatusChanged"));
        setIsProfileDropdownOpen(false);
        setUserName("");
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.message);
      }
    } catch (err) {
      console.error("Error logging out:", err.message);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleLoginStatusChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center">
            <Lottie
              animationData={moonAnimation}
              loop
              autoplay
              className="w-full h-full"
            />
          </div>
          <span
            className="text-white text-2xl font-bold tracking-widest"
            style={{ fontFamily: "'Cinzel Decorative', cursive" }}
          >
            Dreamscape
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 border border-purple-500/40 rounded-full px-6 py-2">
          <Link to="/" className="text-white hover:text-purple-300">
            Home
          </Link>
          <Link to="/journal" className="text-gray-300 hover:text-purple-300">
            Journal
          </Link>
          <Link to="/insights" className="text-gray-300 hover:text-purple-300">
            Insights
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-purple-300">
            About
          </Link>
        </div>

        {/* Desktop Auth/Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-md flex items-center justify-center transition-all duration-150"
              >
                <User className="w-6 h-6 text-white" />
              </button>
              <div
                className={`absolute right-0 mt-2 w-52 bg-gray-900 border border-purple-500/20 text-white rounded-xl shadow-xl backdrop-blur-lg transform transition-all ${
                  isProfileDropdownOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="px-4 py-3 border-b border-purple-500/10 font-medium">
                  {userName ? `Hi, ${userName}` : "Profile"}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-purple-800/20 transition"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/signup"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              <User size={20} />
              <span>Create Account</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-transparent backdrop-blur-md px-6 pb-4 border-t border-white/10">
          <div className="flex flex-col space-y-4 mt-4">
            <Link to="/" className="text-white hover:text-purple-300">
              Home
            </Link>
            <Link to="/journal" className="text-gray-300 hover:text-purple-300">
              Journal
            </Link>
            <Link
              to="/insights"
              className="text-gray-300 hover:text-purple-300"
            >
              Insights
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-purple-300">
              About
            </Link>

            <div className="pt-4 border-t border-white/10">
              {isLoggedIn ? (
                <>
                  <div className="text-white mb-2">Hi, {userName}</div>
                  <button
                    onClick={logout}
                    className="flex items-center w-full text-red-600 hover:text-red-400"
                  >
                    <LogOut size={20} className="mr-2" />
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  to="/signup"
                  className="flex items-center text-white hover:text-purple-300"
                >
                  <User size={20} className="mr-2" />
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
