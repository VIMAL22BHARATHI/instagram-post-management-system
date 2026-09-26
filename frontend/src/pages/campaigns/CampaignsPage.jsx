import React, { useState, useEffect, useCallback } from 'react';
import { campaignService } from '../../services/campaign.service';
import { clientService } from '../../services/client.service';
import { useToast } from '../../context/ToastContext';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { formatDate, formatNumber } from '../../utils/formatters';
import { CAMPAIGN_STATUS, ROLES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Filter,
  Eye,
  Loader2,
} from 'lucide-react';

export const CampaignsPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientIdFilter, setClientIdFilter] = useState('');
  const [page, setPage] = useState(0);

  // Clients options for modal dropdown
  const [clients, setClients] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(CAMPAIGN_STATUS.DRAFT);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clientId, setClientId] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await campaignService.search({
        keyword: keyword || undefined,
        status: statusFilter || undefined,
        clientId: clientIdFilter ? Number(clientIdFilter) : undefined,
        page,
        size: 10,
      });
      setData(res.data);
    } catch (err) {
      showError(err.message || 'Failed to fetch campaigns.');
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter, clientIdFilter, page, showError]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    // Load clients for dropdown selection
    const loadClients = async () => {
      try {
        const res = await clientService.search({ page: 0, size: 100 });
        setClients(res.data.content || []);
      } catch (e) {
        // Silently fail if non-admin user doesn't have client list permission
      }
    };
    loadClients();
  }, []);

  const canManage =
    user?.role === ROLES.ADMIN ||
    user?.role === ROLES.ACCOUNT_MANAGER ||
    user?.role === ROLES.SOCIAL_MEDIA_MANAGER;

  const openCreateModal = () => {
    setEditingCampaign(null);
    setName('');
    setDescription('');
    setStatus(CAMPAIGN_STATUS.DRAFT);
    setStartDate('');
    setEndDate('');
    setClientId(clients.length > 0 ? clients[0].clientId : '');
    setIsModalOpen(true);
  };

  const openEditModal = (camp) => {
    setEditingCampaign(camp);
    setName(camp.name || '');
    setDescription(camp.description || '');
    setStatus(camp.status || CAMPAIGN_STATUS.DRAFT);
    setStartDate(camp.startDate || '');
    setEndDate(camp.endDate || '');
    setClientId(camp.clientId || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      showError('Please select or specify a Client ID.');
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        name,
        description,
        status,
        startDate,
        endDate,
        clientId: Number(clientId),
      };

      if (editingCampaign) {
        await campaignService.update(editingCampaign.campaignId, payload);
        showSuccess('Campaign updated successfully!');
      } else {
        await campaignService.create(payload);
        showSuccess('Campaign created successfully!');
      }
      setIsModalOpen(false);
      fetchCampaigns();
    } catch (err) {
      showError(err.message || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelCampaign = async (campaignId) => {
    if (!window.confirm('Cancel campaign? This soft-deletes the campaign and sets status to CANCELLED.')) return;
    try {
      await campaignService.delete(campaignId);
      showSuccess('Campaign cancelled successfully!');
      fetchCampaigns();
    } catch (err) {
      showError(err.message || 'Action failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Campaign Management</h1>
            <p className="text-xs text-slate-400">Track and manage advertising & influencer campaigns</p>
          </div>
        </div>

        {canManage && (
          <button
            onClick={openCreateModal}
            className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-center gap-4 shadow-lg">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-2 border border-slate-800 rounded-xl w-full md:w-auto">
            <Filter className="w-4 h-4 text-indigo-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full"
            >
              <option value="" className="bg-slate-900 text-white">All Statuses</option>
              {Object.keys(CAMPAIGN_STATUS).map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        {loading ? (
          <Loader className="py-16" />
        ) : !data || data.content.length === 0 ? (
          <div className="p-12 text-center text-xs sm:text-sm text-slate-400">
            No campaigns found matching your criteria.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Campaign</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4 text-right">Impressions</th>
                    <th className="px-6 py-4 text-right">Engagements</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {data.content.map((camp) => (
                    <tr key={camp.campaignId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        <Link to={`/campaigns/${camp.campaignId}`} className="hover:text-indigo-400 transition-colors">
                          {camp.name}
                        </Link>
                        {camp.description && (
                          <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                            {camp.description}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400">{camp.clientName || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <Badge status={camp.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>
                            {formatDate(camp.startDate)} - {formatDate(camp.endDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-200">
                        {formatNumber(camp.totalImpressions)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-indigo-300">
                        {formatNumber(camp.totalEngagements)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          to={`/campaigns/${camp.campaignId}`}
                          className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 inline-block transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {canManage && (
                          <>
                            <button
                              onClick={() => openEditModal(camp)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                              title="Edit Campaign"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancelCampaign(camp.campaignId)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                              title="Cancel Campaign"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination pageResponse={data} onPageChange={(p) => setPage(p)} />
          </>
        )}
      </div>

      {/* Create / Edit Campaign Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampaign ? 'Edit Campaign Details' : 'Create New Campaign'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Summer Influencer Blast 2026"
              required
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about targets and scope..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              >
                {Object.keys(CAMPAIGN_STATUS).map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Client *
              </label>
              {clients.length > 0 ? (
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                >
                  <option value="" className="bg-slate-900 text-white">Select Client</option>
                  {clients.map((c) => (
                    <option key={c.clientId} value={c.clientId} className="bg-slate-900 text-white">
                      {c.clientName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Client ID"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md flex items-center space-x-1.5 disabled:opacity-50 transition-all"
            >
              {formLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingCampaign ? 'Update Campaign' : 'Create Campaign'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

