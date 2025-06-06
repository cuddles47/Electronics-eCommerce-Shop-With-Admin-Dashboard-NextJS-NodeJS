import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

// Extend các type để hỗ trợ role và id
declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }
  
  interface Session {
    user: {
      role?: string;
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

// Export the GET and POST handlers that NextAuth needs
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
