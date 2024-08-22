import { createUploadthing, UTApi, type FileRouter } from "uploadthing/server";
import { UPLOADTHING_SECRET } from "astro:env/server";

const f = createUploadthing();

const auth = (_: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "2GB", maxFileCount: 1000 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export const utapi = new UTApi({
  apiKey: UPLOADTHING_SECRET,
  fetch: (url, init) => {
    if (init && "cache" in init) delete init.cache;
    return fetch(url, init);
  },
});

export type OurFileRouter = typeof ourFileRouter;
