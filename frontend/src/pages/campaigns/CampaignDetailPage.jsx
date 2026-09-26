import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { campaignService } from '../../services/campaign.service';
import { useToast } from '../../context/ToastContext';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { formatDate, formatDateTime, formatNumber } from '../../utils/formatters';
import {
  Megaphone,
  ArrowLeft,
  Calendar,
  User,
  Building,
  BarChart3,
  Eye,
  Heart,
  FileText,
} from 'lucide-react';

export const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await campaignService.getById(id);
        setCampaign(res.data);
      } catch (err) {
        showError(err.message || 'Failed to fetch campaign details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, showError]);

  if (loading) {
    return <Loader className="py-24" />;
  }

  if (!campaign) {
    return (
      <div className="text-center py-24 space-y-4">
        <p className="text-slate-400 font-medium">Campaign not found.</p>
        <Link to="/campaigns" className="text-indigo-400 font-semibold hover:underline">
          Return to Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/campaigns"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </Link>

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-3">
            <Badge status={campaign.status} />
            <span className="text-xs text-slate-400 font-mono">ID: #{campaign.campaignId}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{campaign.name}</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">{campaign.description || 'No description provided.'}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Posts</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">
            {formatNumber(campaign.totalPosts)}
          </span>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Impressions</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">
            {formatNumber(campaign.totalImpressions)}
          </span>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Engagements</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">
            {formatNumber(campaign.totalEngagements)}
          </span>
        </div>
      </div>

      {/* Campaign Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client & Creator Metadata */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800/80 pb-3 uppercase tracking-wider">
            <Building className="w-4 h-4 text-indigo-400" />
            <span>Associated Client & Creator</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Client Name:</span>
              <span className="font-bold text-white">{campaign.clientName || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Client ID:</span>
              <span className="font-mono font-bold text-indigo-400">#{campaign.clientId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Created By:</span>
              <span className="font-semibold text-slate-200">{campaign.createdByName || 'System'}</span>
            </div>
          </div>
        </div>

        {/* Timeline & Audit Metadata */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800/80 pb-3 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Timeline & Audit</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Start Date:</span>
              <span className="font-semibold text-white">{formatDate(campaign.startDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">End Date:</span>
              <span className="font-semibold text-white">{formatDate(campaign.endDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Created Timestamp:</span>
              <span className="text-xs text-slate-300">{formatDateTime(campaign.createdDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Last Updated:</span>
              <span className="text-xs text-slate-300">{formatDateTime(campaign.updatedDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

