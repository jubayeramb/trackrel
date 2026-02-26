// ── Centralized Route Map ─────────────────────────────────────────────────
// Single source of truth for all navigable paths. Import ROUTES wherever
// you'd otherwise hardcode a path string.

export const ROUTES = {
  home: "/",

  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
  },

  dashboard: {
    home: "/dashboard",
    settings: "/dashboard/settings",
    monitors: {
      list: "/dashboard/monitors",
      new: "/dashboard/monitors/new",
      detail: (id: string) => `/dashboard/monitors/${id}` as const,
      edit: (id: string) => `/dashboard/monitors/${id}/edit` as const,
    },
  },

  api: {
    auth: "/api/auth",
  },
} as const;
