import { createUploadthing, UTApi, type FileRouter } from "uploadthing/server";
import { initializeLucia } from "./auth";
import { UPLOADTHING_SECRET } from "astro:env/server";
import type { APIContext } from "astro";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export function createFileRouter(context: APIContext): FileRouter {
  return {
    imageUploader: f({ image: { maxFileSize: "2GB", maxFileCount: 1000 } })
      // Set permissions and file types for this FileRoute
      .middleware(async ({ req }) => {
        console.log(`middleware, ${JSON.stringify(req)}`);
        const lucia = initializeLucia(context.locals.runtime.env.WEDDING_DB);

        const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
        if (!sessionId) throw new Error("Unauthorized");

        const { user } = await lucia.validateSession(sessionId);
        if (!user) throw new Error("Unauthorized");

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id };
      })
      .onUploadComplete(async ({ metadata }) => {
        // console.log(`upload complete: ${JSON.stringify(metadata)}`);
        // This code RUNS ON YOUR SERVER after upload
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      }),
  }
}


export const utapi = new UTApi({
  apiKey: UPLOADTHING_SECRET,
  fetch: (url, init) => {
    if (init && "cache" in init) delete init.cache;
    return fetch(url, init);
  },
});
