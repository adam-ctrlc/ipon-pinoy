import { NextRequest, NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { db, transactions, categories } from "@/db";
import { getAuthUser } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || auth.userId;

  try {
    const rows = await db
      .select({ id: transactions.id, amount: transactions.amount, type: transactions.type, description: transactions.description, date: transactions.date, categoryId: transactions.categoryId, userId: transactions.userId, createdAt: transactions.createdAt, updatedAt: transactions.updatedAt, category: { id: categories.id, name: categories.name, icon: categories.icon, color: categories.color } })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date));

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { amount, type, description, date, categoryId, userId } = await request.json();
    if (!amount || !type || !categoryId) return NextResponse.json({ error: "Amount, type, and category are required" }, { status: 400 });

    const [tx] = await db.insert(transactions).values({ amount: parseFloat(amount), type, description: description || null, date: date ? new Date(date) : new Date(), categoryId, userId: userId || auth.userId }).returning();
    return NextResponse.json(tx, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
