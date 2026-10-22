"use client";

import { catchError, type ErrorInfo } from "next/error";

function WidgetError(_props: { title: string }, { retry }: ErrorInfo) {
  return (
    <div className="space-y-2 text-sm text-red-700">
      <p>לא הצלחנו לטעון את הנתונים.</p>
      <button className="rounded border border-red-700 px-3 py-1" onClick={() => retry()}>
        נסו שוב
      </button>
    </div>
  );
}

export default catchError(WidgetError);
