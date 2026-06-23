import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { user, session, account, verification, categories } from "@/db/schema";

const DEFAULT_CATEGORIES = [
  { name: "Salary", type: "income", icon: "payments", color: "#10b981" },
  { name: "Freelance", type: "income", icon: "laptop_mac", color: "#0ea5e9" },
  { name: "Business", type: "income", icon: "storefront", color: "#8b5cf6" },
  { name: "Investments", type: "income", icon: "trending_up", color: "#f59e0b" },
  { name: "Food & Dining", type: "expense", icon: "restaurant", color: "#f43f5e" },
  { name: "Transportation", type: "expense", icon: "directions_car", color: "#f97316" },
  { name: "Shopping", type: "expense", icon: "shopping_bag", color: "#ec4899" },
  { name: "Utilities", type: "expense", icon: "bolt", color: "#eab308" },
  { name: "Healthcare", type: "expense", icon: "local_hospital", color: "#06b6d4" },
  { name: "Entertainment", type: "expense", icon: "movie", color: "#a855f7" },
  { name: "Education", type: "expense", icon: "school", color: "#3b82f6" },
  { name: "Housing", type: "expense", icon: "home", color: "#84cc16" },
];

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    hashPassword: (password: string) => bcrypt.hash(password, 12),
    verifyPassword: (password: string, hash: string) => bcrypt.compare(password, hash),
  },
  user: {
    additionalFields: {
      username: { type: "string", required: false },
      firstName: { type: "string", required: false },
      lastName: { type: "string", required: false },
      profileImage: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (newUser) => {
          await db.insert(categories).values(
            DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: newUser.id }))
          );
        },
      },
    },
  },
});
