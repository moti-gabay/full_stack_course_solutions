"use client";

export default function DashboardError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="rounded border border-red-300 bg-red-50 p-4">
      <h2 className="font-bold text-red-700">אירעה שגיאה</h2>
      <button onClick={() => retry()} className="mt-2 rounded bg-red-600 px-3 py-1 text-white">
        נסו שוב
      </button>
    </div>
  );
}
