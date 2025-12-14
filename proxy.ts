import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLogin = req.nextUrl.pathname.startsWith("/login");

  // Redirect logged-in users away from login page
  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  // Add protected routes here if needed
  // const isProtected = req.nextUrl.pathname.startsWith("/dashboard");
  // if (isProtected && !isLoggedIn) {
  //   return Response.redirect(new URL("/login", req.nextUrl));
  // }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
