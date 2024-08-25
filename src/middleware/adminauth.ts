import { BYPASS_AUTH } from "astro:env/server";
import { type APIContext, type MiddlewareNext } from "astro";

export async function adminAuth(context: APIContext, next: MiddlewareNext) {
    if (BYPASS_AUTH) {
        return next();
    }

    if (!context.url.pathname.includes("/admin/")) {
        return next();
    }

    if (context.locals.user?.role === "admin") {
        return next();
    }

    return new Response("Unauthorized", { status: 401 });
}