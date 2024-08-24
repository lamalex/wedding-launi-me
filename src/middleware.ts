import { initializeLucia } from "./server/auth";
import { defineMiddleware } from "astro:middleware";
import { BYPASS_AUTH } from "astro:env/server";

export const onRequest = defineMiddleware(async (context, next) => {
  if (BYPASS_AUTH) {
    return next();
  }

  const { locals, cookies } = context;
  const { WEDDING_DB } = locals.runtime.env;
  const lucia = initializeLucia(WEDDING_DB);

  if (context.url.pathname === "/login") {
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
});
