import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { contentService } from '../../services/content.service';
import { templateService } from '../../services/template.service';
import { Loader } from '../../components/common/Loader';
import { formatNumber } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  FileCode,
  Plus,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Layers,
  Edit3,
} from 'lucide-react';

export const ContentCreatorDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [contentPage, setContentPage] = useState(null);
  const [templatesPage, setTemplatesPage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contRes, tempRes] = await Promise.allSettled([
        contentService.search({ page: 0, size: 6 }),
        templateService.search({ page: 0, size: 6 }),
      ]);

      if (contRes.status === 'fulfilled') setContentPage(contRes.value.data);
      if (tempRes.status === 'fulfilled') setTemplatesPage(tempRes.value.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      title: 'Created Content Assets',
      value: contentPage ? formatNumber(contentPage.totalElements) : '0',
      icon: FolderKanban,
      color: 'border-emerald-500/30 hover:border-emerald-500/60',
      accentBg: 'bg-emerald-500/10 text-emerald-400',
      link: '/content-library',
    },
    {
      title: 'Reusable Templates',
      value: templatesPage ? formatNumber(templatesPage.totalElements) : '0',
      icon: FileCode,
      color: 'border-indigo-500/30 hover:border-indigo-500/60',
      accentBg: 'bg-indigo-500/10 text-indigo-400',
      link: '/content-templates',
    },
    {
      title: 'Active Drafts',
      value: 'Drafting',
      icon: Edit3,
      color: 'border-amber-500/30 hover:border-amber-500/60',
      accentBg: 'bg-amber-500/10 text-amber-400',
      link: '/content-library',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-8 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-600/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Creator Studio Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Content Studio & Media Assets
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Welcome, <span className="text-white font-semibold">{user?.fullName || 'Content Creator'}</span>. Upload graphics, manage post captions, leverage templates, and build campaign assets.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <Link
              to="/content-library"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Asset</span>
            </Link>

            <button
              onClick={fetchData}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700/70 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className={`glass-card rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl border border-white/5 ${stat.accentBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold inline-flex items-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  Explore <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Media Assets */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Recent Content Library Assets</h3>
              <p className="text-xs text-slate-400">Images, videos & copy templates</p>
            </div>
          </div>
          <Link
            to="/content-library"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center space-x-1"
          >
            <span>Content Library</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader className="py-12" />
        ) : !contentPage || contentPage.content.length === 0 ? (
          <div className="p-12 text-center text-xs sm:text-sm text-slate-400 flex flex-col items-center justify-center space-y-3">
            <Layers className="w-10 h-10 text-slate-600" />
            <p>No content assets uploaded yet.</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contentPage.content.map((item) => (
              <div key={item.contentId} className="glass-card p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.contentType || 'IMAGE'}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 truncate">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.caption || 'No caption provided'}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                  <span>Reused {item.usageCount || 0}x</span>
                  <Link to="/content-library" className="text-emerald-400 font-semibold hover:text-emerald-300">View Asset</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
