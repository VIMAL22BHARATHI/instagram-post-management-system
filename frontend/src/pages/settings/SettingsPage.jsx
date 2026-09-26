import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/auth.service';
import { ROLE_LABELS } from '../../utils/constants';
import { AppearanceTab } from './AppearanceTab';
import {
  User as UserIcon,
  Settings,
  Bell,
  Key,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Sliders,
  Loader2,
} from 'lucide-react';

export const SettingsPage = ({ initialTab = 'profile' }) => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notifications State
  const [notifyCampaigns, setNotifyCampaigns] = useState(true);
  const [notifySecurity, setNotifySecurity] = useState(true);
  const [notifyContent, setNotifyContent] = useState(false);
  const [notifyUpdates, setNotifyUpdates] = useState(true);
  const [prefLoading, setPrefLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword, confirmPassword });
      showSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showError(err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setPrefLoading(true);
    setTimeout(() => {
      setPrefLoading(false);
      showSuccess('Notification preferences saved successfully!');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Account & Settings</h1>
          <p className="text-xs text-slate-400">Manage your profile, theme preferences, and security settings</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-slate-800/80 gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 text-xs font-semibold rounded-t-xl flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`py-3 px-4 text-xs font-semibold rounded-t-xl flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'appearance'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`py-3 px-4 text-xs font-semibold rounded-t-xl flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'notifications'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-3 px-4 text-xs font-semibold rounded-t-xl flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'security'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Security</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-xl">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl border border-white/10 ring-4 ring-indigo-500/20">
                {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-white">{user?.fullName || 'Authenticated User'}</h2>
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start space-x-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{user?.email}</span>
                </p>
                <div className="pt-2 flex items-center justify-center sm:justify-start space-x-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {ROLE_LABELS[user?.role] || user?.role || 'Member'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Active Account</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 pb-3">
                Account Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 shadow-inner">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-semibold text-white">{user?.fullName || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 shadow-inner">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-white">{user?.email || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 shadow-inner">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">System Role</p>
                  <p className="text-sm font-semibold text-indigo-300">
                    {ROLE_LABELS[user?.role] || user?.role || 'N/A'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 shadow-inner">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">User ID</p>
                  <p className="text-sm font-mono text-slate-300 font-semibold">#{user?.userId || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && <AppearanceTab />}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
              <p className="text-xs text-slate-400">Configure event triggers for dashboard notifications</p>
            </div>

            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                  <div>
                    <p className="text-xs font-bold text-white">Campaign Updates</p>
                    <p className="text-[11px] text-slate-400">Notify when campaigns change status or dates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyCampaigns}
                    onChange={(e) => setNotifyCampaigns(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-800 bg-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                  <div>
                    <p className="text-xs font-bold text-white">Account Security Alerts</p>
                    <p className="text-[11px] text-slate-400">Notify on login attempts and password changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifySecurity}
                    onChange={(e) => setNotifySecurity(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-800 bg-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                  <div>
                    <p className="text-xs font-bold text-white">Content Library Approvals</p>
                    <p className="text-[11px] text-slate-400">Notify when new media assets are uploaded</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyContent}
                    onChange={(e) => setNotifyContent(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-800 bg-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                  <div>
                    <p className="text-xs font-bold text-white">System Feature Releases</p>
                    <p className="text-[11px] text-slate-400">Receive platform news and update announcements</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyUpdates}
                    onChange={(e) => setNotifyUpdates(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-800 bg-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={prefLoading}
                  className="py-2.5 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {prefLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Notification Preferences</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6 max-w-xl shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">Security & Password</h3>
              <p className="text-xs text-slate-400">Change your account password securely</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    minLength={8}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    minLength={8}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="py-2.5 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-xs shadow-md flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

