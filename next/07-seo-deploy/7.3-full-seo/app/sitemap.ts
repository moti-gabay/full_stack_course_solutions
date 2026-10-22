import type { MetadataRoute } from "next";
import { recipes } from "@/lib/recipes";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    ...recipes.map((recipe) => ({ url: `${siteUrl}/recipes/${recipe.slug}` })),
  ];
}
