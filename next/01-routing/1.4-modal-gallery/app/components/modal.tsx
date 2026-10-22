"use client";

import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 p-4" onClick={() => router.back()}>
      <div className="w-full max-w-3xl rounded bg-white p-4" onClick={(event) => event.stopPropagation()}>
        <button onClick={() => router.back()} className="mb-2 rounded bg-slate-200 px-3 py-1">
          סגירה
        </button>
        {children}
      </div>
    </div>
  );
}
