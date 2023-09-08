import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginAuth, findUserByEmail } from "./queries/userQueries";
import { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import { User } from "@prisma/client";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user?: {
            id: number;
            role?: string;
            username?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        id: number;
        role: string;
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
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "admin@smktelkom-mlg.sch.id",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "********",
                },
            },
            async authorize(credentials) {
                let findUser = await loginAuth(
                    credentials?.email || "",
                    credentials?.password || ""
                );
                if (findUser.status != "SUCCESS") return null;
                const user = {
                    id: findUser.user?.id as any,
                    name: findUser.user?.username,
                    email: findUser.user?.email,
                    role: findUser.user?.role || "User",
                };
                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token }) {
            if (token.email) {
                let findUser = await findUserByEmail(token.email!);
                token.username = findUser?.username || token?.username;
                token.role = findUser?.role || "KASIR";
                token.id = findUser?.id as number;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                let findUser = await findUserByEmail(session.user?.email!);
                session.user.name = findUser?.username || session?.user?.name;
                session.user.role = findUser?.role || "User";
                session.user.id = findUser?.id as number;
            }
            return session;
        },
    },
};
