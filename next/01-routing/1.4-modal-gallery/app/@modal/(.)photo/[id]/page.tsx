import { notFound } from "next/navigation";
import Modal from "@/app/components/modal";
import PhotoView from "@/app/components/photo-view";
import { getPhoto, photos } from "@/lib/photos";

export function generateStaticParams() {
  return photos.map((photo) => ({ id: photo.id }));
}

export default async function PhotoModal({ params }: PageProps<"/photo/[id]">) {
  const { id } = await params;
  const photo = getPhoto(id);
  if (!photo) notFound();

  return (
    <Modal>
      <PhotoView photo={photo} />
    </Modal>
  );
}
