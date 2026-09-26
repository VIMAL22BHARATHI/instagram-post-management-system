import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Key, User as UserIcon, Bell, Settings, ChevronDown, Menu } from 'lucide-react';
import { ROLE_LABELS } from '../../utils/constants';
import { IpmsLogo } from '../common/IpmsLogo';

export const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand & Mobile Navigation Trigger */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 md:hidden transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <IpmsLogo variant="horizontal" size="sm" />
        </div>

        <span className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>v1.0 API Connected</span>
        </span>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors focus:outline-none border border-transparent hover:border-slate-800"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-600/20 ring-1 ring-white/10">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.fullName || 'User'}
              </span>
              <span className="text-[10px] font-medium text-indigo-400 leading-tight">
                {ROLE_LABELS[user?.role] || user?.role || 'Member'}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 glass-panel rounded-2xl shadow-2xl py-2 z-50 border border-slate-700/80 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl">
              <div className="px-4 py-2.5 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Authenticated User'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 flex items-center space-x-2.5 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-indigo-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 flex items-center space-x-2.5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/notifications');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 flex items-center space-x-2.5 transition-colors"
                >
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <span>Notifications</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/change-password');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 flex items-center space-x-2.5 transition-colors"
                >
                  <Key className="w-4 h-4 text-indigo-400" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="border-t border-slate-800 my-1" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2.5 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

