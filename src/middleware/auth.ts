import { type APIContext, type MiddlewareNext } from "astro";
import { initializeLucia } from "../server/auth";
import { BYPASS_AUTH } from "astro:env/server";

export async function auth(context: APIContext, next: MiddlewareNext) {
    if (BYPASS_AUTH) {
        return next();
    }

    const { locals, cookies } = context;
    const { WEDDING_DB } = locals.runtime.env;
    const lucia = initializeLucia(WEDDING_DB);

    const unprotectedPaths = new Set(["/login", "/api/uploadthing"]);

    if (unprotectedPaths.has(context.url.pathname)) {
        return next();
    }

    const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
        locals.user = null;
        locals.session = null;
        return context.rewrite(
            new Request(new URL("/login", context.url), {
                headers: {
                    "x-redirect-to": context.url.pathname,
                },
            }),
        );
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );
    }
    if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );
    }

    locals.session = session;
    locals.user = user;
    return next();
};
