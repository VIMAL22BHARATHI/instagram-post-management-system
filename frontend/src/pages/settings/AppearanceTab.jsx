import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  Instagram,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';

export const AppearanceTab = () => {
  const { theme, setTheme, accentColor, setAccentColor, density, setDensity } = useTheme();
  const { showSuccess } = useToast();

  // Interactive Live Preview State
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1842);
  const [isSaved, setIsSaved] = useState(false);

  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  // Accent Color Configurations
  const ACCENT_CONFIGS = [
    {
      id: 'indigo',
      name: 'Indigo Classic',
      subtitle: 'Clean corporate SaaS style',
      swatchBg: 'bg-gradient-to-r from-indigo-600 to-violet-600',
      activeBorder: 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30 shadow-indigo-500/10',
      checkColor: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      btnGradient: 'bg-gradient-to-r from-indigo-600 to-violet-600',
      heartClass: 'text-indigo-500 fill-indigo-500',
      glowRing: 'ring-indigo-500',
    },
    {
      id: 'instagram',
      name: 'Instagram Sunset',
      subtitle: 'Signature brand gradient',
      swatchBg: 'bg-gradient-to-r from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5]',
      activeBorder: 'border-pink-500 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 ring-2 ring-pink-500/30 shadow-pink-500/10',
      checkColor: 'text-pink-400',
      badgeBg: 'bg-gradient-to-r from-[#fa7e1e]/15 via-[#d62976]/15 to-[#962fbf]/15 text-pink-300 border-pink-500/30',
      btnGradient: 'bg-gradient-to-r from-[#fa7e1e] via-[#d62976] to-[#962fbf]',
      heartClass: 'text-[#d62976] fill-[#d62976]',
      glowRing: 'ring-pink-500',
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      subtitle: 'Refreshing cyan & cobalt blue',
      swatchBg: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      activeBorder: 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/30 shadow-cyan-500/10',
      checkColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      btnGradient: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      heartClass: 'text-cyan-500 fill-cyan-500',
      glowRing: 'ring-cyan-500',
    },
    {
      id: 'emerald',
      name: 'Emerald Glow',
      subtitle: 'Vibrant growth emerald green',
      swatchBg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      activeBorder: 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 shadow-emerald-500/10',
      checkColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      btnGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      heartClass: 'text-emerald-500 fill-emerald-500',
      glowRing: 'ring-emerald-500',
    },
  ];

  const currentAccent = ACCENT_CONFIGS.find((a) => a.id === accentColor) || ACCENT_CONFIGS[0];

  // Theme Options
  const THEME_OPTIONS = [
    {
      id: 'dark',
      name: 'Dark Theme',
      subtitle: 'Sleek dark interface (Default)',
      icon: Moon,
      iconBg: 'bg-slate-950 text-indigo-400 border-slate-800',
    },
    {
      id: 'light',
      name: 'Light Theme',
      subtitle: 'Clean bright interface',
      icon: Sun,
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      id: 'system',
      name: 'System Preference',
      subtitle: 'Sync with OS color settings',
      icon: Monitor,
      iconBg: 'bg-slate-900 text-slate-300 border-slate-800',
    },
  ];

  // Density Options
  const DENSITY_OPTIONS = [
    {
      id: 'comfortable',
      name: 'Comfortable',
      subtitle: 'Balanced spacing & standard post view',
      icon: LayoutGrid,
      tag: 'Standard 24px padding',
    },
    {
      id: 'compact',
      name: 'Compact',
      subtitle: 'Dense layout to maximize content density',
      icon: Minimize2,
      tag: '+30% view capacity',
    },
    {
      id: 'spacious',
      name: 'Spacious',
      subtitle: 'Expanded card media & font readability',
      icon: Maximize2,
      tag: 'Enhanced visual focus',
    },
  ];

  const applyInstagramPreset = () => {
    setTheme('dark');
    setAccentColor('instagram');
    setDensity('comfortable');
    showSuccess('Applied Instagram Creator Preset!');
  };

  const resetDefaults = () => {
    setTheme('dark');
    setAccentColor('indigo');
    setDensity('comfortable');
    showSuccess('Reset appearance settings to default');
  };

  return (
    <div className="space-y-6">
      {/* Visual Identity Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel border border-slate-800/80 shadow-2xl">
        {/* Instagram Accent Top Gradient Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5]" />

        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#feda75]/20 via-[#d62976]/20 to-[#4f5bd5]/20 text-[#d62976] border border-[#d62976]/30 shadow-lg shadow-pink-500/10 flex-shrink-0">
              <Instagram className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Appearance & Visual Identity
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#fa7e1e] to-[#d62976] text-white shadow-sm">
                  Pro IPMS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize workspace themes, Instagram accent colorways, and dashboard layout density
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-2 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live Workspace Sync</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Settings Cards (7 Cols on LG) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: Appearance & Theme */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Appearance & Theme</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose your preferred dashboard display theme
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                Mode: {theme.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {THEME_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTheme(opt.id)}
                    className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 transition-all duration-300 transform hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30 scale-[1.02] shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border shadow-inner ${opt.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-400 animate-in zoom-in-50 duration-200 flex-shrink-0" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{opt.name}</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{opt.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Accent Color Swatches */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Accent Color</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a signature color palette to highlight interactive controls & indicators
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${currentAccent.badgeBg}`}>
                {currentAccent.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACCENT_CONFIGS.map((accent) => {
                const isSelected = accentColor === accent.id;
                return (
                  <button
                    key={accent.id}
                    type="button"
                    onClick={() => setAccentColor(accent.id)}
                    className={`p-4 rounded-2xl border text-left flex items-start space-x-3.5 transition-all duration-300 transform hover:-translate-y-0.5 ${
                      isSelected
                        ? `${accent.activeBorder} scale-[1.02] shadow-lg`
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-md'
                    }`}
                  >
                    {/* Swatch Circle / Pill */}
                    <div className="relative pt-0.5">
                      <div className={`w-8 h-8 rounded-xl ${accent.swatchBg} shadow-md border border-white/20 flex items-center justify-center flex-shrink-0`}>
                        {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white truncate">{accent.name}</p>
                        {isSelected && (
                          <CheckCircle2 className={`w-4 h-4 ${accent.checkColor} animate-in zoom-in-50 duration-200 flex-shrink-0 ml-1`} />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{accent.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Dashboard Density */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Dashboard Density</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust content spacing and card padding across your workspace
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 capitalize">
                {density}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DENSITY_OPTIONS.map((d) => {
                const Icon = d.icon;
                const isSelected = density === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDensity(d.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all duration-300 transform hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30 scale-[1.02] shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-slate-900 text-indigo-400 border border-slate-800 shadow-inner">
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-400 animate-in zoom-in-50 duration-200 flex-shrink-0" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">{d.name}</p>
                      <p className="text-xs text-slate-400 mt-1 leading-normal">{d.subtitle}</p>
                    </div>

                    <div className="pt-1">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                        {d.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Instagram Preview & Actions (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-6">
          {/* SECTION 4: Live Instagram Post Card Preview */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <h3 className="text-base font-bold text-white">Preview Card</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Real-Time
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Live preview showing how an Instagram post card renders on your dashboard with selected theme & accent color.
            </p>

            {/* LIVE POST CARD WIDGET CONTAINER */}
            <div
              className={`rounded-2xl border transition-all duration-300 shadow-2xl overflow-hidden ${
                theme === 'light'
                  ? 'bg-white border-slate-200 text-slate-900'
                  : 'bg-slate-950 border-slate-800 text-white'
              }`}
            >
              {/* Card Padding according to Density */}
              <div
                className={`transition-all duration-200 ${
                  density === 'compact'
                    ? 'p-3.5 space-y-3'
                    : density === 'spacious'
                    ? 'p-6 space-y-5'
                    : 'p-5 space-y-4'
                }`}
              >
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Story Gradient Ring around Avatar */}
                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] shadow-sm">
                      <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs border border-white/20">
                        IP
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1">
                        <span
                          className={`font-bold text-xs sm:text-sm tracking-tight ${
                            theme === 'light' ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          ipms.official
                        </span>
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${currentAccent.heartClass.split(' ')[0]} fill-current`}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">Scheduled • Today 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm text-white ${currentAccent.btnGradient} transition-transform active:scale-95`}
                    >
                      Follow
                    </button>
                    <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
                  </div>
                </div>

                {/* Post Media Container */}
                <div
                  className={`relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex flex-col justify-between transition-all duration-200 ${
                    density === 'compact'
                      ? 'h-44'
                      : density === 'spacious'
                      ? 'h-64'
                      : 'h-52'
                  }`}
                >
                  {/* Background Mock Image / Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 opacity-90" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/20 via-purple-500/10 to-transparent" />

                  {/* Top Badges overlay */}
                  <div className="relative p-3 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center space-x-1">
                      <Instagram className="w-3 h-3 text-pink-400" />
                      <span>Instagram Reel</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                      98.4% Score
                    </span>
                  </div>

                  {/* Center Content Graphic */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                    <div className={`p-3 rounded-2xl ${currentAccent.btnGradient} text-white shadow-xl mb-2 animate-bounce`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-white tracking-wide">Summer Growth Campaign '26</p>
                    <p className="text-[10px] text-slate-300">1080 × 1350 • High Engagement Preset</p>
                  </div>

                  {/* Bottom Bar overlay */}
                  <div className="relative p-2.5 bg-slate-950/70 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 z-10">
                    <span>Account: @fashion_hub</span>
                    <span className="font-mono text-indigo-300">#IPMS-8942</span>
                  </div>
                </div>

                {/* Interactive Action Bar */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={handleLikeToggle}
                      className="focus:outline-none transition-transform active:scale-125"
                      title="Click to test like interaction"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-200 ${
                          isLiked
                            ? `${currentAccent.heartClass} animate-in zoom-in-50`
                            : theme === 'light'
                            ? 'text-slate-600 hover:text-red-500'
                            : 'text-slate-300 hover:text-pink-400'
                        }`}
                      />
                    </button>
                    <MessageCircle
                      className={`w-5 h-5 ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    />
                    <Send
                      className={`w-5 h-5 ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSaved(!isSaved)}
                    className="focus:outline-none transition-transform active:scale-110"
                  >
                    <Bookmark
                      className={`w-5 h-5 transition-all ${
                        isSaved
                          ? 'text-indigo-400 fill-indigo-400'
                          : theme === 'light'
                          ? 'text-slate-600'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                </div>

                {/* Likes count & Caption */}
                <div className="space-y-1 pt-1 text-xs">
                  <p
                    className={`font-bold ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {likeCount.toLocaleString()} likes
                  </p>
                  <p
                    className={`leading-relaxed line-clamp-2 ${
                      theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    <span className="font-bold mr-1.5">ipms.official</span>
                    Elevate your Instagram publishing workflow with automated post schedules, multi-account analytics & real-time visual presets! 🚀✨
                  </p>
                  <p className="text-[11px] font-medium text-indigo-400">
                    #InstagramGrowth #SocialMediaManager #IPMS
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Live Preview Control Bar */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Interactive Test Mode</span>
              </div>
              <p className="text-[11px] text-slate-400">Click heart icon above to test active state</p>
            </div>
          </div>

          {/* Quick Apply Presets Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Quick Styling Presets</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={applyInstagramPreset}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#fa7e1e] via-[#d62976] to-[#962fbf] hover:opacity-95 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <Instagram className="w-4 h-4" />
                <span>Apply Instagram Brand Theme</span>
              </button>

              <button
                type="button"
                onClick={resetDefaults}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-xs transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset to Default Style</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
