export function analyze(text, top = 5) {
  const lines = text === "" ? 0 : text.replace(/\r?\n$/, "").split(/\r?\n/).length;
  const words = text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];

  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);

  const topWords = [...counts]
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([word, count]) => ({ word, count }));

  return { lines, words: words.length, topWords };
}
