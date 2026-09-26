export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    const d = new Date(dateTimeString);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateTimeString;
  }
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'DRAFT':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    case 'PAUSED':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'COMPLETED':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case 'CANCELLED':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};
