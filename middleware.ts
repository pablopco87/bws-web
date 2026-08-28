import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Temporary password gate — brutalworkstudio.com is live on Vercel's Hobby plan (no native
 * Deployment Protection) but shouldn't be public yet. This puts the whole site behind HTTP
 * Basic Auth until real launch.
 *
 * How it works:
 * - Every request needs an `Authorization: Basic <base64(user:password)>` header whose
 *   password matches the `SITE_PASSWORD` env var. The username is not checked — type
 *   anything in the browser's auth prompt.
 * - If `SITE_PASSWORD` is not set, the gate is skipped entirely (request passes through).
 *   This is intentional so `npm run dev` never prompts locally — it also means the gate is
 *   only as real as remembering to set `SITE_PASSWORD` in Vercel. Production/Preview must
 *   have it set (Vercel → Settings → Environment Variables) or the site is fully open.
 * - Password comparison is a plain `===`, not constant-time. Fine for keeping casual visitors
 *   out pre-launch; not meant to withstand a targeted attacker.
 *
 * To remove at real launch (do all of these, not just one):
 * 1. Delete this file (or empty out `config.matcher` below so it matches nothing).
 * 2. Remove `SITE_PASSWORD` from Vercel → Settings → Environment Variables (Production + Preview).
 * 3. Redeploy.
 */
export function middleware(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice("Basic ".length));
    const password = decoded.slice(decoded.indexOf(":") + 1);
    if (password === sitePassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Brutal Work Studio"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
