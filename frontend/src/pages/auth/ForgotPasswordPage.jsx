import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { IpmsLogo } from '../../components/common/IpmsLogo';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { showError, showSuccess } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      showSuccess('If that email exists, a password reset email has been sent.');
    } catch (err) {
      showError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 border border-slate-800/80 backdrop-blur-xl">
        <div className="mb-6 text-center flex flex-col items-center">
          <IpmsLogo variant="full" size="lg" glow={true} showTagline={true} className="mb-6" />
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-4 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight self-start">Forgot Password</h1>
          <p className="text-xs text-slate-400 mt-1 self-start">
            Enter your registered email to receive a password reset link
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm leading-relaxed">
            Check your inbox! We've dispatched password reset instructions if your email exists in our records.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.99] flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

