import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { campaignService } from '../../services/campaign.service';
import { instagramService } from '../../services/instagram.service';
import { contentService } from '../../services/content.service';
import { clientService } from '../../services/client.service';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { formatDate, formatNumber } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Instagram,
  FolderKanban,
  Users,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Activity,
  Layers,
} from 'lucide-react';

export const DashboardOverviewPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [campaignsPage, setCampaignsPage] = useState(null);
  const [accountsPage, setAccountsPage] = useState(null);
  const [contentPage, setContentPage] = useState(null);
  const [clientsPage, setClientsPage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campRes, accRes, contRes, cliRes] = await Promise.allSettled([
        campaignService.search({ page: 0, size: 5 }),
        instagramService.list({ page: 0, size: 5 }),
        contentService.search({ page: 0, size: 5 }),
        clientService.search({ page: 0, size: 5 }),
      ]);

      if (campRes.status === 'fulfilled') setCampaignsPage(campRes.value.data);
      if (accRes.status === 'fulfilled') setAccountsPage(accRes.value.data);
      if (contRes.status === 'fulfilled') setContentPage(contRes.value.data);
      if (cliRes.status === 'fulfilled') setClientsPage(cliRes.value.data);
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
      title: 'Active Campaigns',
      value: campaignsPage ? formatNumber(campaignsPage.totalElements) : '0',
      icon: Megaphone,
      color: 'border-indigo-500/30 hover:border-indigo-500/60',
      accentBg: 'bg-indigo-500/10 text-indigo-400',
      link: '/campaigns',
    },
    {
      title: 'Instagram Accounts',
      value: accountsPage ? formatNumber(accountsPage.totalElements) : '0',
      icon: Instagram,
      color: 'border-pink-500/30 hover:border-pink-500/60',
      accentBg: 'bg-pink-500/10 text-pink-400',
      link: '/instagram-accounts',
    },
    {
      title: 'Content Assets',
      value: contentPage ? formatNumber(contentPage.totalElements) : '0',
      icon: FolderKanban,
      color: 'border-emerald-500/30 hover:border-emerald-500/60',
      accentBg: 'bg-emerald-500/10 text-emerald-400',
      link: '/content-library',
    },
    {
      title: 'Managed Clients',
      value: clientsPage ? formatNumber(clientsPage.totalElements) : '0',
      icon: Users,
      color: 'border-cyan-500/30 hover:border-cyan-500/60',
      accentBg: 'bg-cyan-500/10 text-cyan-400',
      link: '/clients',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-8 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-600/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Framewise IPMS Performance Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, {user?.fullName || 'Manager'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Track campaign execution, manage social media profiles, and review real-time influencer engagement metrics across all active clients.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="self-start md:self-auto inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700/70 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                <span className="text-xs font-semibold inline-flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Details <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Campaigns Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Recent Campaigns</h3>
              <p className="text-xs text-slate-400">Live performance & active status stream</p>
            </div>
          </div>
          <Link
            to="/campaigns"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center space-x-1"
          >
            <span>View All Campaigns</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader className="py-12" />
        ) : !campaignsPage || campaignsPage.content.length === 0 ? (
          <div className="p-12 text-center text-xs sm:text-sm text-slate-400 flex flex-col items-center justify-center space-y-3">
            <Layers className="w-10 h-10 text-slate-600" />
            <p>No active campaigns found. Create your first campaign to track metrics!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Campaign Name</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4 text-right">Impressions</th>
                  <th className="px-6 py-4 text-right">Engagements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {campaignsPage.content.map((camp) => (
                  <tr key={camp.campaignId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      <Link to={`/campaigns/${camp.campaignId}`} className="hover:text-indigo-400 transition-colors">
                        {camp.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{camp.clientName || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <Badge status={camp.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(camp.startDate)} - {formatDate(camp.endDate)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-200">
                      {formatNumber(camp.totalImpressions)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-300">
                      {formatNumber(camp.totalEngagements)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

