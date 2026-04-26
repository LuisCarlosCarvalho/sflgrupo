import { NextAuthOptions } from "next-auth";
import { supabase } from "@/lib/supabase";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Usuário ou E-mail", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Usuário/E-mail e senha são obrigatórios.");
        }

        const { data: user, error } = await supabase
          .from('User')
          .select('*')
          .or(`email.eq.${credentials.identifier},username.eq.${credentials.identifier}`)
          .single();

        if (error || !user) {
          throw new Error("Usuário não encontrado.");
        }

        if (!user.password) {
          throw new Error("Usuário não possui senha cadastrada.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Senha incorreta.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          isActive: user.isActive,
          planType: user.planType,
          role: user.role,
          whatsapp: user.whatsapp
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isActive = user.isActive;
        token.planType = user.planType;
        token.role = user.role;
        token.whatsapp = user.whatsapp;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.isActive = token.isActive;
        session.user.planType = token.planType;
        session.user.role = token.role;
        session.user.whatsapp = token.whatsapp;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
} as any;
