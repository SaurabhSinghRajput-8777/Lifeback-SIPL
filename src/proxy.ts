import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { AUTH_ROUTES } from "@/config/routes";
import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";

const isClinicianRoute = createRouteMatcher(["/clinician(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isUserRoute = createRouteMatcher(["/dashboard(.*)", "/assessment(.*)", "/results(.*)", "/resources(.*)"]);
const isPublicRoute = createRouteMatcher(["/", "/about", "/research", "/onboarding", "/how-it-works", "/why-lifeback", `${AUTH_ROUTES.SIGN_IN}(.*)`, `${AUTH_ROUTES.SIGN_UP}(.*)`, "/api/webhooks(.*)", "/api/assessments(.*)", "/assessments/anonymous(.*)"]);

// 60-second in-memory Edge Cache for authorization roles
const roleCache = new Map<string, { role: string; expires: number }>();

async function fetchDbRole(clerkId: string): Promise<string> {
  const cached = roleCache.get(clerkId);
  if (cached && cached.expires > Date.now()) {
    return cached.role;
  }

  let role = "USER"; // Default fallback
  try {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString && !connectionString.includes("localhost")) {
      const pool = new Pool({ connectionString });
      const { rows } = await pool.query('SELECT role FROM "User" WHERE "clerkId" = $1 LIMIT 1', [clerkId]);
      if (rows.length > 0) {
        role = rows[0].role;
      }
      // Edge pools should ideally be closed, but @neondatabase/serverless manages it via HTTP/WebSockets
    }
  } catch (error) {
    console.error("Edge DB Role Fetch Error:", error);
  }

  roleCache.set(clerkId, { role, expires: Date.now() + 60000 });
  return role;
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const session = await auth();
  const clerkId = session.userId;

  // Anonymous check for assessment route
  if (!clerkId && isUserRoute(req)) {
    const anonCookie = req.cookies.get("anonymous_id");
    if (anonCookie) {
      return NextResponse.next();
    }
  }

  if (!clerkId) {
    return session.redirectToSignIn();
  }

  const dbRole = await fetchDbRole(clerkId);

  const roleHierarchy: Record<string, number> = {
    USER: 1,
    CLINICIAN: 2,
    ADMIN: 3,
    SUPER_ADMIN: 4,
  };

  const userLevel = roleHierarchy[dbRole.toUpperCase()] || 0;

  if (isClinicianRoute(req) && userLevel < roleHierarchy["CLINICIAN"]) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAdminRoute(req) && userLevel < roleHierarchy["ADMIN"]) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isUserRoute(req)) {
    if (dbRole.toUpperCase() === "CLINICIAN") {
      return NextResponse.redirect(new URL("/clinician", req.url));
    }
    if (userLevel < roleHierarchy["USER"]) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.SIGN_IN, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
