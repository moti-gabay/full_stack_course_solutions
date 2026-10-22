import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";

export default function GalleryPage() {
  const [hero, ...rest] = photos;

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-3xl font-bold">גלריה (next/image)</h1>
      {/* בלי prefetch: אחרת הדפדפן טוען מראש את תמונות ה-JPEG של דף ההשוואה וההשוואה לא הוגנת */}
      <Link href="/before" prefetch={false} className="underline">
        לגרסת &quot;לפני&quot; עם img רגיל
      </Link>

      {/* התמונה הראשית נמצאת מעל הקפל: נטענת מיד ולא ב-lazy */}
      <Image
        src={hero.src}
        alt={hero.alt}
        sizes="(max-width: 1152px) 100vw, 1152px"
        loading="eager"
        fetchPriority="high"
        className="mt-4 h-auto w-full rounded"
      />

      {/* 1 עמודה בנייד, 2 בטאבלט, 3 בדסקטופ: sizes מתאר בדיוק את זה */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((photo) => (
          <Image
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            className="h-auto w-full rounded"
          />
        ))}
      </div>
    </main>
  );
}
