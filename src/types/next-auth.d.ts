import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's ID. */
      id: string
      role: string
      isAuthorized?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    isAuthorized?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    isAuthorized?: boolean
  }
}
