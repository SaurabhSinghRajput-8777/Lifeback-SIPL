export const ROUTES = {
  public: {
    home: "/",
    about: "/about",
    research: "/research",
    onboarding: "/onboarding",
  },
  auth: {
    login: "/login",
    signup: "/signup",
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
