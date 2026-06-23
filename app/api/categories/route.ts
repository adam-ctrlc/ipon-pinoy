import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db, categories } from "@/db";
import { getAuthUser } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || auth.userId;
  const type = searchParams.get("type");

  try {
    const conditions = type
      ? and(eq(categories.userId, userId), eq(categories.type, type))
      : eq(categories.userId, userId);

    const rows = await db.select().from(categories).where(conditions).orderBy(categories.name);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, type, color, icon, userId } = await request.json();
    if (!name || !type) return NextResponse.json({ error: "Name and type are required" }, { status: 400 });

    const [cat] = await db.insert(categories).values({ name, type, color: color || null, icon: icon || null, userId: userId || auth.userId }).returning();
    return NextResponse.json(cat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
