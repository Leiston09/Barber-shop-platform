// composables/Home/useCanvas.ts

import { ref } from "vue";

export function useCanvas() {
  const images = ref<HTMLImageElement[]>([]);

  // Ahora son 401 frames reales
  const frameCount = 401;

  const currentFrame = (index: number): string => {
    // Los frames van del 0001 al 0401 (1-indexados, sin saltos)
    const realIndex = index + 1;
    const paddedIndex = String(realIndex).padStart(4, "0");
    return `/frames/frame_${paddedIndex}.jpg`;
  };

  const preloadAllImages = (): Promise<void> => {
    return new Promise((resolve) => {
      let loaded = 0;

      const finishLoading = () => {
        loaded++;
        if (loaded === frameCount) resolve();
      };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();

        img.onload = () => {
          images.value[i] = img;
          finishLoading();
        };

        img.onerror = () => finishLoading();

        img.src = currentFrame(i);
      }
    });
  };

  const drawImageOnCanvas = (
    img: HTMLImageElement,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const width = img.width * ratio;
    const height = img.height * ratio;
    const centerX = (canvas.width - width) / 2;
    const centerY = (canvas.height - height) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerX,
      centerY,
      width,
      height,
    );
  };

  return {
    images,
    frameCount,
    preloadAllImages,
    drawImageOnCanvas,
  };
}