import { readFile, writeFile } from "node:fs/promises";
import { analyze } from "./analyze.js";

const file = process.argv[2];

if (!file) {
  console.error("שימוש: node counter.js <קובץ טקסט>");
  process.exit(1);
}

try {
  const text = await readFile(file, "utf8");
  const report = { file, ...analyze(text) };
  await writeFile("report.json", JSON.stringify(report, null, 2));
  console.log(`${report.lines} שורות, ${report.words} מילים. הדוח נשמר ב-report.json`);
} catch (err) {
  if (err.code === "ENOENT") {
    console.error(`שגיאה: הקובץ "${file}" לא נמצא`);
  } else {
    console.error(`שגיאה: ${err.message}`);
  }
  process.exitCode = 1;
}
