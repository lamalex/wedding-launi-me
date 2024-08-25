export const prerender = false;

import { createRouteHandler } from "uploadthing/server";
import { createFileRouter } from "../../server/uploadthing";
import { UPLOADTHING_APP_ID, UPLOADTHING_SECRET } from "astro:env/server";
import { type APIContext } from "astro";

function handler(context: APIContext) {
  const handlers = createRouteHandler({
    router: createFileRouter(context),
    config: {
      logLevel: "trace",
      uploadthingId: UPLOADTHING_APP_ID,
      uploadthingSecret: UPLOADTHING_SECRET,
    },
  });

  if (context.request.method === "GET") {
    return handlers.GET(context);
  } else if (context.request.method === "POST") {
    return handlers.POST(context);
  } else {
    return new Response("Method not allowed", { status: 405 });
  }
}

export async function GET(context: APIContext) {
  return handler(context);
}

export async function POST(context: APIContext) {
  return handler(context);
}