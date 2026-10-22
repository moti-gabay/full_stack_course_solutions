import os from "node:os";

const name = process.argv[2];

console.log(`גרסת Node: ${process.version}`);
console.log(`מערכת הפעלה: ${os.type()} ${os.release()} (${process.platform})`);
console.log(`תאריך: ${new Date().toLocaleString("he-IL")}`);

if (name) {
  console.log(`שלום ${name}, ברוך הבא ל-Node!`);
} else {
  console.log("שימוש: node hello.js <שם>");
  console.log("לדוגמה: node hello.js דנה");
}
