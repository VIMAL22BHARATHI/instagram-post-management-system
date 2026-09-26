import React from 'react';
import { getStatusBadgeColor } from '../../utils/formatters';

export const Badge = ({ children, status, className = '' }) => {
  const colorClasses = status
    ? getStatusBadgeColor(status)
    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${colorClasses} ${className}`}
    >
      {children || status}
    </span>
  );
};
