import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IpmsLogo } from '../common/IpmsLogo';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Instagram,
  FolderKanban,
  FileCode,
  Settings as SettingsIcon,
  Server,
  X,
} from 'lucide-react';
import { ROLES } from '../../utils/constants';

export const Sidebar = ({ mobileOpen = false, onCloseMobile }) => {
  const { user } = useAuth();
  const role = user?.role;

  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: null, // Available to all
    },
    {
      name: 'Clients',
      path: '/clients',
      icon: Users,
      roles: [ROLES.ADMIN, ROLES.ACCOUNT_MANAGER],
    },
    {
      name: 'Campaigns',
      path: '/campaigns',
      icon: Megaphone,
      roles: null,
    },
    {
      name: 'Instagram Accounts',
      path: '/instagram-accounts',
      icon: Instagram,
      roles: [ROLES.ADMIN, ROLES.SOCIAL_MEDIA_MANAGER, ROLES.ACCOUNT_MANAGER],
    },
    {
      name: 'Content Library',
      path: '/content-library',
      icon: FolderKanban,
      roles: null,
    },
    {
      name: 'Content Templates',
      path: '/content-templates',
      icon: FileCode,
      roles: [ROLES.ADMIN, ROLES.ACCOUNT_MANAGER, ROLES.SOCIAL_MEDIA_MANAGER, ROLES.CONTENT_CREATOR, ROLES.TEAM_MEMBER],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: SettingsIcon,
      roles: null,
    },
  ];

  const content = (
    <div className="flex flex-col justify-between h-full p-4 space-y-6">
      <div className="space-y-6">
        {/* Sidebar Brand Header */}
        <div className="px-3 pt-2 pb-4 border-b border-slate-800/80 flex items-center justify-between">
          <IpmsLogo variant="horizontal" size="sm" />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="px-3 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>
          {role && (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {role.replace('_', ' ')}
            </span>
          )}
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const hasAccess =
              !item.roles || (role && item.roles.includes(role));

            if (!hasAccess) return null;

            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 via-indigo-600/20 to-violet-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:border-slate-800 border border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Host System Info Widget */}
      <div className="p-3.5 rounded-2xl glass-card text-xs text-slate-400 space-y-1.5 border border-slate-800/80 shadow-md">
        <div className="flex items-center justify-between font-bold text-slate-200">
          <div className="flex items-center space-x-2">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span>Backend Server</span>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>
        <p className="text-[11px] font-mono text-slate-400">Spring Boot :8080</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#090d16] border-r border-slate-800/80 hidden md:flex flex-col min-h-[calc(100vh-4rem)] sticky top-16 h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[80vw] bg-[#090d16] border-r border-slate-800 flex flex-col h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};

