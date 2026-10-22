import Image from "next/image";
import type { Photo } from "@/lib/photos";

export default function PhotoView({ photo }: { photo: Photo }) {
  return (
    <figure>
      <Image src={photo.src} alt={photo.title} width={800} height={600} sizes="(min-width: 768px) 768px, 100vw" className="rounded" />
      <figcaption className="mt-2 text-center font-semibold">{photo.title}</figcaption>
    </figure>
  );
}
