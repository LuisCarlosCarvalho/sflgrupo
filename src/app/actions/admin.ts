"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        plan: true,
        whatsapp: true,
        planExpiresAt: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  plan: string;
  whatsapp?: string;
  amount?: number;
}) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: data.role,
      plan: data.plan,
      whatsapp: data.whatsapp,
      status: "ACTIVE",
      planExpiresAt: expiresAt,
    },
  });

  if (data.amount && data.amount > 0) {
    await prisma.transaction.create({
      data: {
        type: "INCOME",
        category: "PLAN_RENEWAL",
        amount: data.amount,
        description: `Primeiro pagamento: ${data.email}`,
      },
    });
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/finance");
  return user;
}

export async function editUser(
  userId: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: "USER" | "ADMIN";
    plan?: string;
    whatsapp?: string;
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TRIAL";
    planExpiresAt?: Date;
  }
) {
  const updateData: any = {
    name: data.name,
    email: data.email ? data.email.toLowerCase().trim() : undefined,
    role: data.role,
    plan: data.plan,
    whatsapp: data.whatsapp,
    status: data.status,
    planExpiresAt: data.planExpiresAt,
  };

  if (data.password && data.password.trim()) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  revalidatePath("/admin/users");
  return user;
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserStatus(
  userId: string,
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TRIAL"
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
  revalidatePath("/admin/users");
  return user;
}

export async function renewUserPlan(userId: string, days: number = 30, amount: number = 0) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const currentExpiry = user?.planExpiresAt && user.planExpiresAt > new Date() ? user.planExpiresAt : new Date();
  const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status: "ACTIVE",
      planExpiresAt: newExpiry,
    },
  });

  if (amount > 0 && user?.email) {
    await prisma.transaction.create({
      data: {
        type: "INCOME",
        category: "PLAN_RENEWAL",
        amount,
        description: `Renovação de Plano: ${user.email}`,
      },
    });
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/finance");
  return updatedUser;
}

export async function getFinanceOverview() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });

    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, curr) => acc + curr.amount, 0);

    return { transactions, income, expense, balance: income - expense };
  } catch (error) {
    console.error("Error fetching finance overview:", error);
    return { transactions: [], income: 0, expense: 0, balance: 0 };
  }
}

export async function addTransaction(data: {
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  description: string;
}) {
  const transaction = await prisma.transaction.create({
    data: {
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description,
    },
  });

  revalidatePath("/admin/finance");
  return transaction;
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({
    where: { id },
  });
  revalidatePath("/admin/finance");
  return { success: true };
}
