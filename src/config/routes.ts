export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
} as const;

export const ROUTES = {
  public: {
    home: "/",
    about: "/about",
    research: "/research",
    onboarding: "/onboarding",
  },
  user: {
    dashboard: "/dashboard",
    assessment: "/assessment",
    results: (id: string) => `/results/${id}`,
    resources: "/resources",
  },
  clinician: {
    dashboard: "/clinician",
    patient: (id: string) => `/clinician/patient/${id}`,
  },
  admin: {
    dashboard: "/admin",
  },
};
