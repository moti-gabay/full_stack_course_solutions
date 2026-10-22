import { Suspense } from "react";
import WidgetErrorBoundary from "./widget-error-boundary";

// Each widget gets its own error boundary (outside) and Suspense (inside)
export function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border p-4">
      <h2 className="mb-3 font-semibold">{title}</h2>
      <WidgetErrorBoundary title={title}>
        <Suspense fallback={<div className="h-16 animate-pulse rounded bg-zinc-200" />}>
          {children}
        </Suspense>
      </WidgetErrorBoundary>
    </section>
  );
}
