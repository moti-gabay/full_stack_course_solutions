import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מתכונים",
  description: "כל המתכונים באתר: ארוחות בוקר, צהריים וקינוחים.",
};

export default function RecipesPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">מתכונים</h1>
      <ul className="mt-2 list-disc ps-6">
        <li>שקשוקה</li>
        <li>פסטה ברוטב עגבניות</li>
        <li>עוגת שוקולד</li>
      </ul>
    </>
  );
}
