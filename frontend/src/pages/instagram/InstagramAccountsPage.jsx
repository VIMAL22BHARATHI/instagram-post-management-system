import React, { useState, useEffect, useCallback } from 'react';
import { instagramService } from '../../services/instagram.service';
import { useToast } from '../../context/ToastContext';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { formatDate, formatDateTime, formatNumber } from '../../utils/formatters';
import { ACCOUNT_TYPES, ROLES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import {
  Instagram,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const InstagramAccountsPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);

  // Syncing state tracker
  const [syncingId, setSyncingId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES.BUSINESS);
  const [formLoading, setFormLoading] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await instagramService.list({
        keyword: keyword || undefined,
        page,
        size: 10,
      });
      setData(res.data);
    } catch (err) {
      showError(err.message || 'Failed to fetch Instagram accounts.');
    } finally {
      setLoading(false);
    }
  }, [keyword, page, showError]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const canManage =
    user?.role === ROLES.ADMIN ||
    user?.role === ROLES.SOCIAL_MEDIA_MANAGER ||
    user?.role === ROLES.ACCOUNT_MANAGER;

  const openConnectModal = () => {
    setUsername('');
    setInstagramId('');
    setAccessToken('');
    setAccountType(ACCOUNT_TYPES.BUSINESS);
    setIsModalOpen(true);
  };

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await instagramService.connect({
        username,
        instagramId,
        accessToken,
        accountType,
      });
      showSuccess('Instagram account connected successfully!');
      setIsModalOpen(false);
      fetchAccounts();
    } catch (err) {
      showError(err.message || 'Failed to connect account.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSync = async (accountId) => {
    setSyncingId(accountId);
    try {
      await instagramService.sync(accountId);
      showSuccess('Account stats synced successfully!');
      fetchAccounts();
    } catch (err) {
      showError(err.message || 'Sync failed.');
    } finally {
      setSyncingId(null);
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!window.confirm('Disconnect this Instagram account?')) return;
    try {
      await instagramService.disconnect(accountId);
      showSuccess('Account disconnected successfully!');
      fetchAccounts();
    } catch (err) {
      showError(err.message || 'Disconnect failed.');
    }
  };

  return (
    <RoleGuard
      allowedRoles={[
        ROLES.ADMIN,
        ROLES.SOCIAL_MEDIA_MANAGER,
        ROLES.ACCOUNT_MANAGER,
      ]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-rose-500/10 text-pink-400 border border-pink-500/20 shadow-md">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Instagram Accounts
              </h1>
              <p className="text-xs text-slate-400">
                Connect and sync Instagram business/creator profiles
              </p>
            </div>
          </div>

          {canManage && (
            <button
              onClick={openConnectModal}
              className="py-2.5 px-4 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-pink-600/25 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Connect Account</span>
            </button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-center shadow-lg">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-pink-400 transition-colors" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
              placeholder="Search by username or Instagram ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Accounts Grid / Table */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          {loading ? (
            <Loader className="py-16" />
          ) : !data || data.content.length === 0 ? (
            <div className="p-12 text-center text-xs sm:text-sm text-slate-400">
              No connected Instagram accounts found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Username</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Followers</th>
                      <th className="px-6 py-4 text-right">Following</th>
                      <th className="px-6 py-4 text-right">Posts</th>
                      <th className="px-6 py-4">Last Sync</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {data.content.map((acc) => (
                      <tr key={acc.accountId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">
                          <div className="flex items-center space-x-2">
                            <Instagram className="w-4 h-4 text-pink-400" />
                            <span>@{acc.username}</span>
                            {acc.isConnected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="Connected" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">ID: {acc.instagramId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950 text-slate-300 border border-slate-800">
                            {acc.accountType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-200">
                          {formatNumber(acc.followersCount)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-200">
                          {formatNumber(acc.followingCount)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-200">
                          {formatNumber(acc.postsCount)}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {formatDateTime(acc.lastSync)}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {canManage && (
                            <>
                              <button
                                onClick={() => handleSync(acc.accountId)}
                                disabled={syncingId === acc.accountId}
                                className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors disabled:opacity-50"
                                title="Sync Stats"
                              >
                                <RefreshCw className={`w-4 h-4 ${syncingId === acc.accountId ? 'animate-spin' : ''}`} />
                              </button>
                              <button
                                onClick={() => handleDisconnect(acc.accountId)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                title="Disconnect Account"
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

        {/* Connect Account Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Connect Instagram Account"
        >
          <form onSubmit={handleConnectSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Instagram Username *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. brand_official"
                required
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Instagram Business ID *
              </label>
              <input
                type="text"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                placeholder="e.g. 17841400000000000"
                required
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Access Token *
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Graph API token (Encrypted at rest)"
                required
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Account Type *
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-200"
              >
                {Object.keys(ACCOUNT_TYPES).map((typeKey) => (
                  <option key={typeKey} value={typeKey} className="bg-slate-900 text-white">
                    {typeKey}
                  </option>
                ))}
              </select>
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
                className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md flex items-center space-x-1.5 disabled:opacity-50 transition-all"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Connect Account</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </RoleGuard>
  );
};

