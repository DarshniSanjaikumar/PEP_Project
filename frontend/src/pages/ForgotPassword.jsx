import React, { useState } from 'react';
import { Mail, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5001'; // Replace with your actual API URL

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setShowSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setError('');
    setIsLoading(false);
    setShowSuccess(false);
  };

  const handleBackToLogin = () => {
    // You can replace this with your actual navigation logic
    console.log('Navigate back to login');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-purple-900 p-6 text-white">
      <div className="w-full max-w-md bg-gray-800/30 border border-purple-600/20 backdrop-blur-xl p-8 rounded-3xl relative z-10">
        {/* Success State */}
        {showSuccess ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Email Sent Successfully!</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We've sent a password reset link to <span className="text-purple-400 font-medium">{email}</span>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <div className="space-y-3">
              <button
                onClick={resetForm}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-all duration-300"
              >
                Send Another Email
              </button>
              <button
                onClick={handleBackToLogin}
                className="w-full bg-gray-600/40 border border-gray-500/30 text-gray-300 px-8 py-4 rounded-full font-medium hover:bg-gray-600/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={32} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Forgot Your Password?</h2>
              <p className="text-gray-300 leading-relaxed">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 mb-6 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-600/40 rounded-full border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 transition-all"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full bg-gray-600/40 border border-gray-500/30 text-gray-300 px-8 py-4 rounded-full font-medium hover:bg-gray-600/60 transition-all duration-300 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;