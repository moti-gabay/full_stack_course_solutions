export type Photo = {
  id: string;
  title: string;
  src: string;
};

const picsumIds = [10, 11, 15, 16, 17, 28, 29, 37, 40];

export const photos: Photo[] = picsumIds.map((picsumId, index) => ({
  id: String(index + 1),
  title: `תמונה ${index + 1}`,
  src: `https://picsum.photos/id/${picsumId}/800/600`,
}));

export function getPhoto(id: string) {
  return photos.find((photo) => photo.id === id);
}
