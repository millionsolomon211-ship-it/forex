import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authContainer } from "@/auth/container"
import { AuthenticationError } from "@/auth/core/domain/errors"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await authContainer.authenticateUserUseCase.execute({
            email: credentials.email,
            password: credentials.password as string
          });

          return {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role,
            isAuthorized: result.isAuthorized
          };
        } catch (error) {
          if (error instanceof AuthenticationError) {
            return null;
          }
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAuthorized = user.isAuthorized;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAuthorized = token.isAuthorized as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login', 
  },
  session: {
    strategy: "jwt"
  }
})
   