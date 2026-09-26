import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRoleDashboardPath, ROLE_LABELS } from '../../utils/constants';

export const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    const userRoleLabel = ROLE_LABELS[user?.role] || user?.role || 'Unknown';
    const myDashboardPath = getRoleDashboardPath(user?.role);

    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 glass-panel rounded-3xl border border-rose-500/30 text-center max-w-lg mx-auto mt-12 shadow-2xl backdrop-blur-xl">
        <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 mb-5 border border-rose-500/20 shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Access Restricted</h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Your account role (<span className="text-rose-400 font-bold">{userRoleLabel}</span>) does not have authorization to view or perform actions in this area.
        </p>

        <Link
          to={myDashboardPath}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to My Dashboard</span>
        </Link>
      </div>
    );
  }

  return children;
};
