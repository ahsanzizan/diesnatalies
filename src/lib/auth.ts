import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import { findUserByEmail, loginAuth } from "./queries/userQueries";

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
                    credentials?.email as string || "",
                    credentials?.password as string || ""
                );

                if (findUser.status != "SUCCESS") return null;
                const user = {
                    id: findUser.user?.id as any,
                    username: findUser.user?.username,
                    email: findUser.user?.email,
                    role: findUser.user?.role || "KASIR",
                };
                
                return user;
            },
        })
    ],
    callbacks: {
        async jwt({ token }) {
            if (token.email) {
                let findUser = await findUserByEmail(token.email!);
                token.name = findUser?.username || token?.name;
                token.role = findUser?.role || "KASIR";
                token.id = findUser?.id as any;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                let findUser = await findUserByEmail(session.user?.email!);
                session.user.username = findUser?.username || session?.user?.username;
                session.user.role = findUser?.role || "KASIR";
                session.user.id = findUser?.id.toString() as string;
            }
            return session;
        },
    },
};
