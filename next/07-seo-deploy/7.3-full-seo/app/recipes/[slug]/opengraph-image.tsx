import { ImageResponse } from "next/og";
import { getRecipe, recipes } from "@/lib/recipes";

export const alt = "Recipe preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// בלי generateStaticParams כאן ה-route הזה דינמי (ƒ) ונוצר בכל בקשה.
// איתו, תמונה לכל מתכון נבנית מראש ב-build.
export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

// תמונה שנוצרת מהנתונים של כל מתכון
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#ea580c",
          color: "white",
        }}
      >
        <div style={{ fontSize: 36, opacity: 0.85 }}>Home Kitchen</div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 16 }}>
          {recipe?.title ?? "Recipe"}
        </div>
        {recipe && (
          <div style={{ fontSize: 40, marginTop: 24 }}>{`${recipe.minutes} minutes`}</div>
        )}
      </div>
    ),
    size,
  );
}
