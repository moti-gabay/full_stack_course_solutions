"use client";

export function DeleteButton() {
  return (
    <button
      className="rounded border border-red-600 px-3 py-1 text-red-600"
      onClick={(e) => {
        // ביטול ב-confirm עוצר את שליחת הטופס, וה-action לא נקרא
        if (!confirm("למחוק את הפוסט?")) e.preventDefault();
      }}
    >
      מחק
    </button>
  );
}
