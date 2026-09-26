export const ROLES = {
  ADMIN: 'ADMIN',
  ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
  SOCIAL_MEDIA_MANAGER: 'SOCIAL_MEDIA_MANAGER',
  CONTENT_CREATOR: 'CONTENT_CREATOR',
  ANALYST: 'ANALYST',
  CLIENT: 'CLIENT',
  TEAM_MEMBER: 'TEAM_MEMBER',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.ACCOUNT_MANAGER]: 'Account Manager',
  [ROLES.SOCIAL_MEDIA_MANAGER]: 'Social Media Manager',
  [ROLES.CONTENT_CREATOR]: 'Content Creator',
  [ROLES.ANALYST]: 'Analyst',
  [ROLES.CLIENT]: 'Client',
  [ROLES.TEAM_MEMBER]: 'Team Member',
};

export const ROLE_DASHBOARDS = {
  [ROLES.ADMIN]: '/dashboard/admin',
  [ROLES.ACCOUNT_MANAGER]: '/dashboard/account-manager',
  [ROLES.SOCIAL_MEDIA_MANAGER]: '/dashboard/social-media-manager',
  [ROLES.CONTENT_CREATOR]: '/dashboard/content-creator',
  [ROLES.ANALYST]: '/dashboard/analyst',
  [ROLES.CLIENT]: '/dashboard/client',
  [ROLES.TEAM_MEMBER]: '/dashboard/team-member',
};

export const getRoleDashboardPath = (role) => {
  return ROLE_DASHBOARDS[role] || '/dashboard/admin';
};

export const CAMPAIGN_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const CONTENT_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  AUDIO: 'AUDIO',
  OTHER: 'OTHER',
};

export const ACCOUNT_TYPES = {
  PERSONAL: 'PERSONAL',
  BUSINESS: 'BUSINESS',
  CREATOR: 'CREATOR',
};
