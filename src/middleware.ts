import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/employees/:path*",
    "/departments/:path*",
    "/positions/:path*",
    "/leaves/:path*",
    "/payroll/:path*",
    "/reports/:path*",
    "/profile/:path*",
    "/api/employees/:path*",
    "/api/departments/:path*",
    "/api/positions/:path*",
    "/api/leaves/:path*",
    "/api/payroll/:path*",
    "/api/bonuses/:path*",
  ]
};
