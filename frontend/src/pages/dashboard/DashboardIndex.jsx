import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRoleDashboardPath } from '../../utils/constants';
import { Loader } from '../../components/common/Loader';

export const DashboardIndex = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader size="lg" className="py-20" />;
  }

  const targetPath = getRoleDashboardPath(user?.role);
  return <Navigate to={targetPath} replace />;
};
