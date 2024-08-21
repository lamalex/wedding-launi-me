import { initializeLucia } from "./server/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  console.log("MIDDLEWARE");
  const { locals, cookies } = context;
  const { WEDDING_DB } = locals.runtime.env;
  const lucia = initializeLucia(WEDDING_DB);

  const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;
  console.log("MIDDLEWARE: sessionId", sessionId);
  if (!sessionId) {
    locals.user = null;
    locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  console.log("MIDDLEWARE: session", JSON.stringify(session));
  console.log("MIDDLEWARE: user", JSON.stringify(user));
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
