import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-bold">גלריה</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((photo) => (
          <Link key={photo.id} href={`/photo/${photo.id}`}>
            <Image
              src={photo.src}
              alt={photo.title}
              width={800}
              height={600}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="rounded"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
