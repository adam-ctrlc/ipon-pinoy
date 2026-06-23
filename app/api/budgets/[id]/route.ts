import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, budgets, categories } from "@/db";
import { getAuthUser } from "@/lib/auth-server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const [budget] = await db.select({ id: budgets.id, name: budgets.name, amount: budgets.amount, period: budgets.period, startDate: budgets.startDate, endDate: budgets.endDate, categoryId: budgets.categoryId, userId: budgets.userId, createdAt: budgets.createdAt, updatedAt: budgets.updatedAt, category: { id: categories.id, name: categories.name, icon: categories.icon, color: categories.color } }).from(budgets).leftJoin(categories, eq(budgets.categoryId, categories.id)).where(eq(budgets.id, id)).limit(1);
    if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { name, amount, period, startDate, endDate, categoryId } = await request.json();
    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (amount !== undefined) data.amount = parseFloat(amount);
    if (period !== undefined) data.period = period;
    if (startDate !== undefined) data.startDate = new Date(startDate);
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
    if (categoryId !== undefined) data.categoryId = categoryId || null;

    const [budget] = await db.update(budgets).set(data).where(eq(budgets.id, id)).returning();
    if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await db.delete(budgets).where(eq(budgets.id, id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
