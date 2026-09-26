import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { RoleGuard } from '../components/auth/RoleGuard';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ROLES } from '../utils/constants';

import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { ChangePasswordPage } from '../pages/auth/ChangePasswordPage';

import { DashboardIndex } from '../pages/dashboard/DashboardIndex';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { AccountManagerDashboardPage } from '../pages/dashboard/AccountManagerDashboardPage';
import { SocialMediaManagerDashboardPage } from '../pages/dashboard/SocialMediaManagerDashboardPage';
import { ContentCreatorDashboardPage } from '../pages/dashboard/ContentCreatorDashboardPage';
import { AnalystDashboardPage } from '../pages/dashboard/AnalystDashboardPage';
import { ClientDashboardPage } from '../pages/dashboard/ClientDashboardPage';
import { TeamMemberDashboardPage } from '../pages/dashboard/TeamMemberDashboardPage';

import { ClientsPage } from '../pages/clients/ClientsPage';
import { CampaignsPage } from '../pages/campaigns/CampaignsPage';
import { CampaignDetailPage } from '../pages/campaigns/CampaignDetailPage';
import { InstagramAccountsPage } from '../pages/instagram/InstagramAccountsPage';
import { ContentLibraryPage } from '../pages/content/ContentLibraryPage';
import { ContentTemplatesPage } from '../pages/templates/ContentTemplatesPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardIndex />} />

          {/* Role-Specific Dashboards */}
          <Route
            path="/dashboard/admin"
            element={
              <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard/account-manager"
            element={
              <RoleGuard allowedRoles={[ROLES.ACCOUNT_MANAGER]}>
                <AccountManagerDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard/social-media-manager"
            element={
              <RoleGuard allowedRoles={[ROLES.SOCIAL_MEDIA_MANAGER]}>
                <SocialMediaManagerDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard/content-creator"
            element={
              <RoleGuard allowedRoles={[ROLES.CONTENT_CREATOR]}>
                <ContentCreatorDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard/analyst"
            element={
              <RoleGuard allowedRoles={[ROLES.ANALYST]}>
                <AnalystDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard/client"
            element={
              <RoleGuard allowedRoles={[ROLES.CLIENT]}>
                <ClientDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard/team-member"
            element={
              <RoleGuard allowedRoles={[ROLES.TEAM_MEMBER]}>
                <TeamMemberDashboardPage />
              </RoleGuard>
            }
          />

          {/* Module Routes protected by RoleGuard */}
          <Route
            path="/clients"
            element={
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ACCOUNT_MANAGER]}>
                <ClientsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/instagram-accounts"
            element={
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ACCOUNT_MANAGER, ROLES.SOCIAL_MEDIA_MANAGER]}>
                <InstagramAccountsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/content-templates"
            element={
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ACCOUNT_MANAGER, ROLES.SOCIAL_MEDIA_MANAGER, ROLES.CONTENT_CREATOR, ROLES.TEAM_MEMBER]}>
                <ContentTemplatesPage />
              </RoleGuard>
            }
          />

          {/* Shared Module Routes */}
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/content-library" element={<ContentLibraryPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<SettingsPage initialTab="profile" />} />
          <Route path="/notifications" element={<SettingsPage initialTab="notifications" />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
