import type { DefaultUser, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import { findUserByUname, loginAuth } from "./queries/userQueries";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user?: {
            id: string;
            role?: string;
            username?: string;
            someExoticUserProperty?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        username: string;
        nama: string;
        role: string;
        id: string;
    }
}

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Log In",
            credentials: {
                username: {
                    label: "Username",
                    type: "username",
                    placeholder: "username admin",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "********",
                },
            },
            async authorize(credentials) {
                let findUser = await loginAuth(
                    credentials?.username as string || "",
                    credentials?.password as string || ""
                );

                if (findUser.status != "SUCCESS") return null;
                const user = {
                    id: findUser.user?.id as any,
                    username: credentials?.username,
                    nama: findUser.user?.nama,
                    role: findUser.user?.role || "KASIR",
                };

                return user;
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token }) {
            if (token.username) {
                if (session.user) {
                    let findUser = await findUserByUname(token.username);
                    session.user.username = findUser?.username || token.username;
                    session.user.role = findUser?.role || "KASIR";
                    session.user.id = findUser?.id.toString() as string;
                }
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
};
