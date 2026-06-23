import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, categories } from "@/db";
import { getAuthUser } from "@/lib/auth-server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const [cat] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(cat);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { name, type, color, icon } = await request.json();
    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (type !== undefined) data.type = type;
    if (color !== undefined) data.color = color;
    if (icon !== undefined) data.icon = icon;

    const [cat] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(cat);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await db.delete(categories).where(eq(categories.id, id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
