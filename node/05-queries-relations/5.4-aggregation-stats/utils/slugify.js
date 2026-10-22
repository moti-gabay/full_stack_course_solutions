// "Pasta  Bake!" -> "pasta-bake"; \p{L} keeps letters in any language, Hebrew included
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
