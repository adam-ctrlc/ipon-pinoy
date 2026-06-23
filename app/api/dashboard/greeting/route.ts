import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";

function getGreetingData(hour: number) {
  if (hour >= 5 && hour < 12) return { greeting: "Magandang Umaga", greetingIcon: "wb_sunny" };
  if (hour >= 12 && hour < 13) return { greeting: "Magandang Tanghali", greetingIcon: "sunny" };
  if (hour >= 13 && hour < 18) return { greeting: "Magandang Hapon", greetingIcon: "light_mode" };
  return { greeting: "Magandang Gabi", greetingIcon: "bedtime" };
}

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Manila", {
      next: { revalidate: 900 },
    });

    if (res.ok) {
      const data = await res.json();
      const hour = new Date(data.datetime).getHours();
      return NextResponse.json(getGreetingData(hour));
    }
  } catch {
    // fallback
  }

  const manilaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
  const hour = new Date(manilaTime).getHours();
  return NextResponse.json(getGreetingData(hour));
}
