import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, user as users } from "@/db";
import { getAuthUser } from "@/lib/auth-server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const [user] = await db.select({ id: users.id, email: users.email, username: users.username, firstName: users.firstName, lastName: users.lastName, profileImage: users.profileImage, createdAt: users.createdAt, updatedAt: users.updatedAt }).from(users).where(eq(users.id, id)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { firstName, lastName, email, username, profileImage, password } = await request.json();

    const data: Record<string, unknown> = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (email !== undefined) data.email = email;
    if (username !== undefined) data.username = username;
    if (profileImage !== undefined) data.profileImage = profileImage;
    if (password) data.password = await bcrypt.hash(password, 12);

    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning({ id: users.id, email: users.email, username: users.username, firstName: users.firstName, lastName: users.lastName, profileImage: users.profileImage, createdAt: users.createdAt, updatedAt: users.updatedAt });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await db.delete(users).where(eq(users.id, id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
