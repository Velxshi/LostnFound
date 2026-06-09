// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const permissionRouteMap: Record<string, string> = {
  "menu:dashboard": "/admin",
  "menu:category": "/admin/category",
  "menu:users": "/admin/users",
  "menu:hak-akses": "/admin/hak-akses",
};

const routePermissionMap: Record<string, string> = {
  "/admin": "menu:dashboard",
  "/admin/reports": "menu:dashboard",
  "/admin/map": "menu:dashboard",
  "/admin/category": "menu:category",
  "/admin/users": "menu:users",
  "/admin/hak-akses": "menu:hak-akses",
};
const userOnlyRoutes = ["/notifications", "/reports"];

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const { searchParams } = req.nextUrl;

    const isManualVisit = searchParams.get("mode") === "public";
    const permissions: string[] = (token?.permissions as string[]) ?? [];

    const isUserOnlyRoute = userOnlyRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
    const isFormLaporanRoute = pathname.startsWith("/form/");

    if ((isUserOnlyRoute || isFormLaporanRoute) && token?.roleId === 3) {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }

    if (pathname === "/" && !isManualVisit) {
      if (token?.roleId === 1) {
        const hasDashboard = permissions.includes("menu:dashboard");
        const hasCategory = permissions.includes("menu:category");

        let adminDefaultRoute = "/admin/profile";
        if (hasDashboard) {
          adminDefaultRoute = "/admin";
        } else if (hasCategory) {
          adminDefaultRoute = "/admin/category";
        }

        return NextResponse.redirect(new URL(adminDefaultRoute, req.url));
      }
      if (token?.roleId === 3) {
        const firstAllowed = Object.entries(permissionRouteMap).find(([perm]) => permissions.includes(perm));
        const destination = firstAllowed ? firstAllowed[1] : "/forbidden";
        return NextResponse.redirect(new URL(destination, req.url));
      }
    }

    if (pathname.startsWith("/admin") && token?.roleId !== 1 && token?.roleId !== 3) {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }

    // if (pathname.startsWith('/admin') && token?.roleId === 3) {
    //   const requiredPermission = routePermissionMap[pathname]
    //   if (requiredPermission && !permissions.includes(requiredPermission)) {
    //     return NextResponse.redirect(new URL('/forbidden', req.url))
    //   }
    // }

    if (pathname.startsWith("/admin") && (token?.roleId === 1 || token?.roleId === 3)) {
      const requiredPermission = routePermissionMap[pathname];
      if (requiredPermission && !permissions.includes(requiredPermission)) {
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/api") && !token) {
          return false;
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/notifications/:path*", "/reports/:path*", "/about/:path*", "/form/:path*", "/"],
};
