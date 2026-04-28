import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db"
import User from "@/models/User"

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
        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isPasswordValid) {
          return null;
        }

        // Must have verified email unless they are ADMIN (or we can enforce it strictly later)
        // if (!user.emailVerified) {
        //   throw new Error("Please verify your email first.");
        // }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isAuthorized: user.isAuthorized
        };
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
