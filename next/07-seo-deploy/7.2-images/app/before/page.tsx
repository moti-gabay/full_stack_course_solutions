/* eslint-disable @next/next/no-img-element -- זו בכוונה גרסת ה"לפני" להשוואה */
import Link from "next/link";
import { photos } from "@/lib/photos";

export default function BeforePage() {
  const [hero, ...rest] = photos;

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-3xl font-bold">גלריה לפני (img רגיל)</h1>
      <Link href="/" prefetch={false} className="underline">
        לגרסה עם next/image
      </Link>

      <img
        src={`/photos/photo-${hero.id}.jpg`}
        alt={hero.alt}
        className="mt-4 h-auto w-full rounded"
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((photo) => (
          <img
            key={photo.id}
            src={`/photos/photo-${photo.id}.jpg`}
            alt={photo.alt}
            className="h-auto w-full rounded"
          />
        ))}
      </div>
    </main>
  );
}
