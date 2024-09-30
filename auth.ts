import NextAuth, { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

import FacebookProvider, {
  FacebookProfile,
} from "next-auth/providers/facebook";
import GitHub, { GitHubProfile } from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

const prisma = new PrismaClient();

const config = {
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  providers: [
    GitHub({
      profile(profile: GitHubProfile) {
        return {
          id: profile.id.toString(),
          role: "user",
          email: profile.email,
          name: profile.name,
          image: profile.avatar_url,
        };
      },
    }),
    FacebookProvider({
      profile(profile: FacebookProfile) {
        return {
          id: profile.id.toString(),
          role: "user",
          email: profile.email,
          name: profile.name,
          image: profile.picture.data.url,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  basePath: "/auth",
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    jwt({ token, trigger, session, account, user }) {
      if (user) token.role = user.role;

      if (trigger === "update") token.name = session.user.name;
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.role = user.role;
      }

      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

declare module "next-auth" {
  interface User {
    role: string;
  }
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    accessToken?: string;
  }
}
