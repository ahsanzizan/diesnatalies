import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) { }, {
    callbacks: {
        authorized: ({ req, token }) => {
            const pathname = req.nextUrl.pathname;
            if ((pathname.startsWith("/admin") && !token?.role?.includes("ADMIN")) || (pathname.startsWith('/kasir') && !token?.role?.includes('KASIR'))) {
                return false;
            }
            return true;
        },
    },
});