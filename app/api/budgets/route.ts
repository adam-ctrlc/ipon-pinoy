import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, budgets, categories } from "@/db";
import { getAuthUser } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || auth.userId;

  try {
    const rows = await db
      .select({ id: budgets.id, name: budgets.name, amount: budgets.amount, period: budgets.period, startDate: budgets.startDate, endDate: budgets.endDate, categoryId: budgets.categoryId, userId: budgets.userId, createdAt: budgets.createdAt, updatedAt: budgets.updatedAt, category: { id: categories.id, name: categories.name, icon: categories.icon, color: categories.color } })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .where(eq(budgets.userId, userId))
      .orderBy(budgets.createdAt);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, amount, period, startDate, endDate, categoryId, userId } = await request.json();
    if (!name || !amount || !period || !startDate) return NextResponse.json({ error: "Name, amount, period, and startDate are required" }, { status: 400 });

    const [budget] = await db.insert(budgets).values({ name, amount: parseFloat(amount), period, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, categoryId: categoryId || null, userId: userId || auth.userId }).returning();
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
