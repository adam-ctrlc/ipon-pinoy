import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, user } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const result = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
    return NextResponse.json({ exists: result.length > 0 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
