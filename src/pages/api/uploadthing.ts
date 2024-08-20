export const prerender = false;

import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "../../server/uploadthing";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: "trace",
    uploadthingId: import.meta.env.UPLOADTHING_APP_ID,
    uploadthingSecret: import.meta.env.UPLOADTHING_SECRET,
  },
});
