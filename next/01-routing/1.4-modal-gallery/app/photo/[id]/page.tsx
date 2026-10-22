import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoView from "@/app/components/photo-view";
import { getPhoto, photos } from "@/lib/photos";

export function generateStaticParams() {
  return photos.map((photo) => ({ id: photo.id }));
}

export default async function PhotoPage({ params }: PageProps<"/photo/[id]">) {
  const { id } = await params;
  const photo = getPhoto(id);
  if (!photo) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-blue-600 underline">
        חזרה לגלריה
      </Link>
      <h1 className="my-4 text-2xl font-bold">דף מלא: {photo.title}</h1>
      <PhotoView photo={photo} />
    </main>
  );
}
