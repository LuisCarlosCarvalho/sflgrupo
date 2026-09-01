import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      status?: string;
      plan?: string;
      username?: string | null;
      isActive?: boolean;
      planType?: string | null;
      whatsapp?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    status?: string;
    plan?: string;
    username?: string | null;
    isActive?: boolean;
    planType?: string | null;
    whatsapp?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    status?: string;
    plan?: string;
    username?: string | null;
    isActive?: boolean;
    planType?: string | null;
    whatsapp?: string | null;
  }
}
