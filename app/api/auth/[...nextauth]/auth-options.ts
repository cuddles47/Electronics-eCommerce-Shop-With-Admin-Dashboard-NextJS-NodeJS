import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

// Auth configuration options 
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password!
            );
            if (isPasswordCorrect) {
              return {
                id: user.id,
                email: user.email,
                name: user.email.split('@')[0], // Add name for NextAuth User type
                role: user.role || "user",
              };
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    })
  ],
  callbacks: {
    async signIn(params) {
      const { user, account, profile } = params;
      
      if (account?.provider === "credentials") {
        return true;
      }
      
      if (account?.provider === "google") {
        try {
          // Kiểm tra xem người dùng đã tồn tại chưa
          const existingUser = await prisma.user.findFirst({
            where: { email: user.email! }
          });
          
          // Nếu người dùng chưa tồn tại, tạo mới
          if (!existingUser && user.email) {
            await prisma.user.create({
              data: {
                id: nanoid(),
                email: user.email,
                password: "", // OAuth không cần password
                role: "user", // Default role cho Google users
              }
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      
      return true;
    },
    async session({ session, token }) {
      // Thêm thông tin role vào session
      if (session?.user && token?.sub) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
          });
          
          if (user) {
            session.user.role = user.role || "user";
            session.user.id = user.id;
          }
        } catch (error) {
          console.error("Error fetching user data for session:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
