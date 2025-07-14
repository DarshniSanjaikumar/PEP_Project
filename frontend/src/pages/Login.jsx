import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, Star, Moon, Cloud, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  const floatingElements = [
    { id: 1, icon: Star, size: 16, delay: 0, duration: 6000 },
    { id: 2, icon: Moon, size: 20, delay: 1000, duration: 8000 },
    { id: 3, icon: Cloud, size: 24, delay: 2000, duration: 7000 },
    { id: 4, icon: Star, size: 14, delay: 3000, duration: 9000 },
    { id: 5, icon: Moon, size: 18, delay: 4000, duration: 5000 },
    { id: 6, icon: Cloud, size: 22, delay: 5000, duration: 6500 },
  ];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user info (Note: In artifacts, localStorage is not available)
      // For demo purposes, we'll simulate success
      console.log('Login successful!', data);
      
      // In real implementation, uncomment these lines:
      // localStorage.setItem('dreamscape_token', data.token);
      // localStorage.setItem('dreamscape_user', JSON.stringify(data.user));
      // navigate('/');
      
      navigate('/');
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleForgotPassword = () => {
    alert('Password reset link would be sent to your email');
  };

  const handleSignupRedirect = () => {
    console.log('Redirecting to signup...');
    alert('Redirecting to signup page...');
    // In real implementation: navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white flex items-center justify-center p-6">
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
              className="absolute opacity-20 animate-pulse"
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

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Background Card */}
        <div className="relative bg-gray-800/30 backdrop-blur-xl rounded-3xl overflow-hidden p-8 border border-gray-700/50">
          
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute top-8 left-8 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse"
              style={{
                transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
                transition: 'transform 0.5s ease-out'
              }}
            ></div>
            <div 
              className="absolute bottom-8 right-8 w-20 h-20 bg-pink-500/20 rounded-full blur-xl animate-pulse"
              style={{
                transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
                transition: 'transform 0.6s ease-out'
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-400/30">
                <LogIn size={24} className="text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DreamScape Login
              </h1>
              <p className="text-gray-400 text-sm">
                Continue your dream exploration journey
              </p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Username */}
              <div>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-6 py-4 bg-gray-600/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-600/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-gray-600/40 border border-gray-500/30 rounded focus:ring-purple-400 focus:ring-2 text-purple-400"
                  />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Signup Link */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={handleSignupRedirect}
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline"
                >
                  Sign up for free
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;