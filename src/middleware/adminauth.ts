
import { initializeLucia } from "../server/auth";
import { BYPASS_AUTH } from "astro:env/server";

export async function adminAuth(context, next) {
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