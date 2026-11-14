export function barberPhotoUrl(id?: string, revision?: string | null) {
  if (!id || !/^[a-f\d]{24}$/i.test(id)) return "";
  return (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "") + "/barbers/" + id + "/photo" +
    (revision ? "?v=" + encodeURIComponent(revision) : "");
}
export async function prepareBarberPhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024)
    throw new Error("Selecciona una imagen JPG, PNG o WebP de hasta 8 MB.");
  const image = await createImageBitmap(file);
  try {
    if (!image.width || !image.height || image.width * image.height > 40000000)
      throw new Error("La imagen es demasiado grande. Utiliza una fotografía más pequeña.");
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 640;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo preparar la fotografía.");
    const side = Math.min(image.width, image.height);
    context.fillStyle = "#171717"; context.fillRect(0, 0, 640, 640);
    context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 640, 640);
    return canvas.toDataURL("image/jpeg", 0.86).split(",")[1]!;
  } finally { image.close(); }
}
