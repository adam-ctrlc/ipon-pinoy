import type { Category } from "@/types/category";

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  date: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category: Pick<Category, "id" | "name" | "icon" | "color"> | null;
}
