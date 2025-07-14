import React, { useState, useEffect } from 'react';
import { ChevronLeft, Mail, Shield, User, Lock, ArrowRight, Star, Moon, Cloud, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');

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

  // Floating particles data
  const floatingElements = [
    { id: 1, icon: Star, size: 16, delay: 0, duration: 6000 },
    { id: 2, icon: Moon, size: 20, delay: 1000, duration: 8000 },
    { id: 3, icon: Cloud, size: 24, delay: 2000, duration: 7000 },
    { id: 4, icon: Star, size: 14, delay: 3000, duration: 9000 },
    { id: 5, icon: Moon, size: 18, delay: 4000, duration: 5000 },
    { id: 6, icon: Cloud, size: 22, delay: 5000, duration: 6500 },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    // Clear message when user starts typing
    if (message) {
      setMessage('');
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 2:
        if (!formData.code) {
          newErrors.code = 'Verification code is required';
        } else if (formData.code.length !== 6) {
          newErrors.code = 'Code must be 6 digits';
        }
        break;
      case 3:
        if (!formData.username) {
          newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
          newErrors.username = 'Username must be at least 3 characters';
        }
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Simulate axios call - replace with actual axios import and call
      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Verification code sent successfully!');
        setCurrentStep(2);
      } else {
        setMessage(data.message || 'Something went wrong');
        setErrors({ email: data.message || 'Failed to send verification code' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      setMessage(errorMessage);
      setErrors({ email: errorMessage });
    }

    setIsLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Simulate axios call - replace with actual axios import and call
      const response = await fetch('http://localhost:5001/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          code: formData.code 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Code verified successfully!');
        setCurrentStep(3);
      } else {
        setMessage(data.message || 'Verification failed');
        setErrors({ code: data.message || 'Invalid or expired code' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verification failed';
      setMessage(errorMessage);
      setErrors({ code: errorMessage });
    }

    setIsLoading(false);
  };

  const handleRegister = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Simulate axios call - replace with actual axios import and call
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Registration completed successfully!');
        setCurrentStep(4);
      } else {
        setMessage(data.message || 'Registration failed');
        setErrors({ username: data.message || 'Registration failed' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setMessage(errorMessage);
      setErrors({ username: errorMessage });
    }

    setIsLoading(false);
  };

  const handleNext = () => {
    switch (currentStep) {
      case 1:
        handleSendCode();
        break;
      case 2:
        handleVerifyCode();
        break;
      case 3:
        handleRegister();
        break;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setMessage('');
      setErrors({});
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New verification code sent!');
      } else {
        setMessage(data.message || 'Failed to resend code');
      }
    } catch (error) {
      setMessage('Failed to resend code');
    }

    setIsLoading(false);
  };

  const handleRedirectToHome = () => {
    console.log('Redirecting to home page...');
    navigate('/');
    // Add your navigation logic here
  };

  const handleSignIn = () => {
    console.log('Redirecting to sign in...');
    // Add your navigation logic here
    navigate('/login');
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return Mail;
      case 2: return Shield;
      case 3: return User;
      case 4: return CheckCircle;
      default: return Mail;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Signup to DreamScape';
      case 2: return 'Verify Your Email';
      case 3: return 'Create Your Account';
      case 4: return 'Welcome to DreamScape!';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Explore the dreamers realm';
      case 2: return 'We sent a verification code to your email';
      case 3: return 'Choose your username and secure password';
      case 4: return 'Your account has been created successfully';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="example@dreamscape.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-6 py-4 bg-gray-600/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
              />
              {errors.email && (
                <p className="mt-2 text-red-400 text-sm ml-4">{errors.email}</p>
              )}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-4">
                Code sent to <span className="text-purple-400">{formData.email}</span>
              </p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-6 py-4 bg-gray-600/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-center text-lg tracking-widest"
                maxLength="6"
              />
              {errors.code && (
                <p className="mt-2 text-red-400 text-sm text-center">{errors.code}</p>
              )}
            </div>
            <div className="text-center">
              <button 
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Resend code'}
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-6 py-4 bg-gray-600/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
              />
              {errors.username && (
                <p className="mt-2 text-red-400 text-sm ml-4">{errors.username}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-6 py-4 bg-gray-600/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
              />
              {errors.password && (
                <p className="mt-2 text-red-400 text-sm ml-4">{errors.password}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-6 py-4 bg-gray-600/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-red-400 text-sm ml-4">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <CheckCircle size={40} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white mb-2">
                Welcome {formData.username}!
              </h3>
              <p className="text-gray-300">
                Your dream exploration journey begins now
              </p>
            </div>
            <button
              onClick={handleRedirectToHome}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Enter Dream World</span>
              <ArrowRight size={16} />
            </button>
          </div>
        );
    }
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
                {React.createElement(getStepIcon(currentStep), { size: 24, className: "text-purple-400" })}
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {getStepTitle()}
              </h1>
              <p className="text-gray-400 text-sm">
                {getStepDescription()}
              </p>
              
              {/* Progress dots */}
              <div className="flex justify-center space-x-2 mt-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      step <= currentStep 
                        ? 'bg-purple-400' 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-center text-sm ${
                message.includes('successfully') || message.includes('sent') 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-400/30'
              }`}>
                {message}
              </div>
            )}

            {/* Step Content */}
            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation Button */}
            {currentStep < 4 && (
              <div className="space-y-4">
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>
                        {currentStep === 1 ? 'Send Verification Code' : 
                         currentStep === 2 ? 'Verify Code' : 
                         'Create Account'}
                      </span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600/30 backdrop-blur-sm rounded-full border border-gray-500/30 text-gray-300 hover:bg-gray-600/50 transition-all duration-300 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                )}
              </div>
            )}

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button 
                  onClick={handleSignIn}
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;