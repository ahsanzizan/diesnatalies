import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

interface CookieOptions {
    secure: boolean;
}

interface SessionOptions {
    password: string;
    cookieName: string;
    cookieOptions: CookieOptions;
}

const options: SessionOptions = {
    password: process.env.COOKIE_PASSWORD!,
    cookieName: process.env.COOKIE_NAME!,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    }
};

export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, options);
}