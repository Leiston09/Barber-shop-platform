export async function prepareSiteImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024)
    throw new Error("Selecciona una imagen JPG, PNG o WebP de hasta 8 MB.");
  const image = await createImageBitmap(file);
  try {
    if (!image.width || !image.height || image.width * image.height > 40000000)
      throw new Error("Utiliza una imagen más pequeña.");
    const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No pudimos preparar la imagen.");
    ctx.fillStyle = "#171717"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.88, 0.76, 0.62, 0.48]) {
      const photo = canvas.toDataURL("image/jpeg", quality).split(",")[1]!;
      if (photo.length <= 1398104) return photo;
    }
    throw new Error("La imagen es demasiado pesada. Selecciona otra más pequeña.");
  } finally { image.close(); }
}
