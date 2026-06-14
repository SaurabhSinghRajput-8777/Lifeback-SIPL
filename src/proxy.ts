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

let globalPool: Pool | null = null;

function getPool() {
  if (!globalPool) {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString && !connectionString.includes("localhost")) {
      globalPool = new Pool({ connectionString });
    }
  }
  return globalPool;
}

async function fetchDbRole(clerkId: string): Promise<string> {
  const cached = roleCache.get(clerkId);
  if (cached && cached.expires > Date.now()) {
    return cached.role;
  }

  let role = "USER"; // Default fallback
  try {
    const pool = getPool();
    if (pool) {
      const { rows } = await pool.query('SELECT role FROM "User" WHERE "clerkId" = $1 LIMIT 1', [clerkId]);
      if (rows.length > 0) {
        role = rows[0].role;
      }
    }
  } catch (error) {
    console.error("Edge DB Role Fetch Error:", error);
  }

  roleCache.set(clerkId, { role, expires: Date.now() + 60000 });
  return role;
}

export default clerkMiddleware(async (auth, req) => {
  console.time('Middleware_Total');
  if (isPublicRoute(req)) {
    console.timeEnd('Middleware_Total');
    return NextResponse.next();
  }

  const session = await auth();
  let clerkId = session.userId;
  
  if (!clerkId && process.env.NODE_ENV === "development" && req.headers.has('x-mock-clerk-id')) {
    clerkId = req.headers.get('x-mock-clerk-id') as string;
  }

  // Anonymous check for assessment route
  if (!clerkId && isUserRoute(req)) {
    const anonCookie = req.cookies.get("anonymous_id");
    if (anonCookie) {
      console.timeEnd('Middleware_Total');
      return NextResponse.next();
    }
  }

  if (!clerkId) {
    console.timeEnd('Middleware_Total');
    return session.redirectToSignIn();
  }

  console.time('Middleware_fetchDbRole');
  const dbRole = await fetchDbRole(clerkId);
  console.timeEnd('Middleware_fetchDbRole');

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
      console.timeEnd('Middleware_Total');
      return NextResponse.redirect(new URL("/clinician", req.url));
    }
    if (userLevel < roleHierarchy["USER"]) {
      console.timeEnd('Middleware_Total');
      return NextResponse.redirect(new URL(AUTH_ROUTES.SIGN_IN, req.url));
    }
  }

  console.timeEnd('Middleware_Total');
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
