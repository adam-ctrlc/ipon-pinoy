import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, transactions, categories } from "@/db";
import { getAuthUser } from "@/lib/auth-server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const [tx] = await db.select({ id: transactions.id, amount: transactions.amount, type: transactions.type, description: transactions.description, date: transactions.date, categoryId: transactions.categoryId, userId: transactions.userId, createdAt: transactions.createdAt, updatedAt: transactions.updatedAt, category: { id: categories.id, name: categories.name, icon: categories.icon, color: categories.color } }).from(transactions).leftJoin(categories, eq(transactions.categoryId, categories.id)).where(eq(transactions.id, id)).limit(1);
    if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tx);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { amount, type, description, date, categoryId } = await request.json();
    const data: Record<string, unknown> = {};
    if (amount !== undefined) data.amount = parseFloat(amount);
    if (type !== undefined) data.type = type;
    if (description !== undefined) data.description = description;
    if (date !== undefined) data.date = new Date(date);
    if (categoryId !== undefined) data.categoryId = categoryId;

    const [tx] = await db.update(transactions).set(data).where(eq(transactions.id, id)).returning();
    if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tx);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await db.delete(transactions).where(eq(transactions.id, id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
