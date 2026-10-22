export type Recipe = {
  id: number;
  title: string;
  ingredients: string[];
  prepMinutes: number;
};

// "מסד" בזיכרון: מתאפס בכל הפעלה מחדש של השרת
export const recipes: Recipe[] = [
  { id: 1, title: "שקשוקה", ingredients: ["ביצים", "עגבניות", "פלפל"], prepMinutes: 20 },
  { id: 2, title: "סלט ירקות", ingredients: ["מלפפון", "עגבנייה", "בצל"], prepMinutes: 10 },
];
