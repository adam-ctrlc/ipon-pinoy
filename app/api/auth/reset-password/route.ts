import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { db, user, account } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    const [u] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
    if (!u) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const hashed = await bcrypt.hash(password, 12);
    await db.update(account).set({ password: hashed }).where(and(eq(account.userId, u.id), eq(account.providerId, "credential")));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
