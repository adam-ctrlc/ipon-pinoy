import type { Category } from "@/types/category";

export interface Budget {
  id: string;
  name: string;
  amount: number;
  period: string;
  startDate: string;
  endDate: string | null;
  categoryId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category: Pick<Category, "id" | "name" | "icon" | "color"> | null;
}
