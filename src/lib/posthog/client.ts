import posthog from "posthog-js";
import { env } from "../env/env";

export const initPostHog = () => {
  if (typeof window !== "undefined") {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
    });
  }
};
