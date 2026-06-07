import { serve } from "inngest/next";
import { inngest } from "../../../lib/inngest/client";

// This is a placeholder for the jobs we'll add later
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
  ],
});
