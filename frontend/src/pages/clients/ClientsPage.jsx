import React, { useState, useEffect, useCallback } from 'react';
import { clientService } from '../../services/client.service';
import { useToast } from '../../context/ToastContext';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  Building2,
  Mail,
  Loader2,
} from 'lucide-react';

export const ClientsPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [accountManagerId, setAccountManagerId] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Assign Manager Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignClientId, setAssignClientId] = useState(null);
  const [newManagerId, setNewManagerId] = useState('');

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientService.search({
        keyword: keyword || undefined,
        page,
        size: 10,
      });
      setData(res.data);
    } catch (err) {
      showError(err.message || 'Failed to fetch clients.');
    } finally {
      setLoading(false);
    }
  }, [keyword, page, showError]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const openCreateModal = () => {
    setEditingClient(null);
    setClientName('');
    setContactEmail('');
    setCompanyName('');
    setAccountManagerId(user?.role === ROLES.ACCOUNT_MANAGER ? (user?.userId || '') : '');
    setIsModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setClientName(client.clientName || '');
    setContactEmail(client.contactEmail || '');
    setCompanyName(client.companyName || '');
    setAccountManagerId(client.accountManagerId || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const effectiveManagerId = accountManagerId
        ? Number(accountManagerId)
        : (user?.role === ROLES.ACCOUNT_MANAGER && user?.userId ? Number(user.userId) : null);

      const payload = {
        clientName,
        contactEmail,
        companyName: companyName || null,
        accountManagerId: effectiveManagerId,
      };

      if (editingClient) {
        await clientService.update(editingClient.clientId, payload);
        showSuccess('Client updated successfully!');
      } else {
        await clientService.create(payload);
        showSuccess('Client created successfully!');
      }
      setIsModalOpen(false);
      fetchClients();
    } catch (err) {
      showError(err.message || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('Are you sure you want to deactivate this client?')) return;
    try {
      await clientService.delete(clientId);
      showSuccess('Client deactivated successfully!');
      fetchClients();
    } catch (err) {
      showError(err.message || 'Deactivation failed.');
    }
  };

  const openAssignManagerModal = (clientId, currentManagerId) => {
    setAssignClientId(clientId);
    setNewManagerId(currentManagerId || '');
    setIsAssignModalOpen(true);
  };

  const handleAssignManagerSubmit = async (e) => {
    e.preventDefault();
    if (!newManagerId) return;
    setFormLoading(true);
    try {
      await clientService.assignManager(assignClientId, Number(newManagerId));
      showSuccess('Account manager assigned successfully!');
      setIsAssignModalOpen(false);
      fetchClients();
    } catch (err) {
      showError(err.message || 'Assignment failed.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ACCOUNT_MANAGER]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Client Management</h1>
              <p className="text-xs text-slate-400">Manage clients, accounts, and assigned account managers</p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-center shadow-lg">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
              placeholder="Search by client name, email, or company..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          {loading ? (
            <Loader className="py-16" />
          ) : !data || data.content.length === 0 ? (
            <div className="p-12 text-center text-xs sm:text-sm text-slate-400">
              No clients found matching criteria.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Client Name</th>
                      <th className="px-6 py-4">Contact Email</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Account Manager</th>
                      <th className="px-6 py-4">Created Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {data.content.map((cli) => (
                      <tr key={cli.clientId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>{cli.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          <div className="flex items-center space-x-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{cli.contactEmail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {cli.companyName ? (
                            <div className="flex items-center space-x-1.5">
                              <Building2 className="w-3.5 h-3.5 text-slate-500" />
                              <span>{cli.companyName}</span>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 text-indigo-300 font-semibold">
                          {cli.accountManagerName ? (
                            <div className="flex items-center space-x-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{cli.accountManagerName}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic font-normal">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-400">{formatDate(cli.createdDate)}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {user?.role === ROLES.ADMIN && (
                            <>
                              <button
                                onClick={() => openAssignManagerModal(cli.clientId, cli.accountManagerId)}
                                className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                title="Assign Manager"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(cli)}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                                title="Edit Client"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(cli.clientId)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                title="Deactivate Client"
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

        {/* Create / Edit Client Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingClient ? 'Edit Client Details' : 'Create New Client'}
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Acme Corp"
                required
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@acme.com"
                required
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Global Inc."
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Account Manager ID
              </label>
              <input
                type="number"
                value={accountManagerId}
                onChange={(e) => setAccountManagerId(e.target.value)}
                placeholder={user?.role === ROLES.ACCOUNT_MANAGER ? `Assigned to your User ID (${user?.userId || ''})` : "User ID of Account Manager"}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
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
                  <span>{editingClient ? 'Update Client' : 'Create Client'}</span>
                )}
              </button>
            </div>
          </form>
        </Modal>

        {/* Assign Manager Modal */}
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title="Assign Account Manager"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAssignManagerSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Account Manager User ID *
              </label>
              <input
                type="number"
                value={newManagerId}
                onChange={(e) => setNewManagerId(e.target.value)}
                placeholder="Enter Manager User ID"
                required
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
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
                    <span>Assigning...</span>
                  </>
                ) : (
                  <span>Assign Manager</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </RoleGuard>
  );
};

