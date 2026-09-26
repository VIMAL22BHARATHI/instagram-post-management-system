import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { FramewiseLogo } from '../components/common/FramewiseLogo';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] px-4 text-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="glass-panel p-10 sm:p-12 rounded-3xl max-w-md w-full border border-slate-800/80 space-y-6 relative z-10 shadow-2xl">
        <div className="flex justify-center mb-2">
          <FramewiseLogo size="lg" />
        </div>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-white">
            404
          </h1>
          <h2 className="text-lg font-bold text-slate-200 mt-2">Page Not Found</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or you don't have access permissions.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 py-2.5 px-5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

