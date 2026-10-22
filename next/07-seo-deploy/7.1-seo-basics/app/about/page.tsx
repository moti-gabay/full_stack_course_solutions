import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אודות",
};

export default function AboutPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">אודות</h1>
      <p className="mt-2">אתר מתכונים קטן שנבנה כתרגיל ב-Next.js.</p>
    </>
  );
}
