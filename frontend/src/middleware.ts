import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const headers = new Headers(request.headers);
//   headers.set("x-current-path", pathname);

//   const hasCookie = request.cookies.get("access_token");
//   // console.log({ hasCookie, pathname, url: request.url, nextUrl: request.nextUrl });
//   if (hasCookie) {
//     if (pathname === "/login") {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   } else {
//     // console.log("Not logged in");
//     // if (pathname.startsWith("/wallet") || pathname.startsWith("/agent")) {
//     //   return NextResponse.redirect(new URL("/login?redirected=1", request.url));
//     // }
//   }

//   return NextResponse.next({ headers });
// }

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.gif$|.*\\.webp$|.*\\.webmanifest$).*)",
  ],
};
