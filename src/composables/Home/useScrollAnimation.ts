// composables/Home/useScrollAnimation.ts

import { ref, type Ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(
  containerRef: Ref<HTMLElement | null>,
  sceneLayerRef: Ref<HTMLElement | null>,
) {
  const currentScene = ref(0);
  const frameCount = 401; // ← mismo que useCanvas

  const setupAnimation = (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    images: HTMLImageElement[],
    drawFn: (
      img: HTMLImageElement,
      context: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
    ) => void,
  ) => {
    if (!containerRef.value || !sceneLayerRef.value) return;

    const scenes = Array.from(
      sceneLayerRef.value.querySelectorAll<HTMLElement>("[data-scene]"),
    );

    if (!scenes.length) return;

    // Welcome ocupa la mitad que las demás (ya está cargado cuando llega el usuario)
    // Duraciones individuales por escena (deben sumar 1.0)
    const holdDurations = [0.1, 0.225, 0.225, 0.225, 0.225];
    const fadeDuration = 0.03;

    gsap.set(sceneLayerRef.value, { opacity: 1 });
    gsap.set(scenes, { opacity: 0, y: 60 });

    const firstScene = scenes[0];
    if (firstScene) {
      gsap.set(firstScene, { opacity: 1, y: 0 });
    }

    const sceneTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: () => {
          currentScene.value = 0;
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const sceneIndex = Math.min(
            scenes.length - 1,
            Math.floor(progress * scenes.length),
          );
          currentScene.value = sceneIndex;
        },
      },
    });

    scenes.forEach((scene, index) => {
      const isFirst = index === 0;
      const isLast = index === scenes.length - 1;

      // Tiempo reservado para cada escena (según su índice)
      const holdDuration = holdDurations[index] ?? 0.225;
      const segmentDuration = holdDuration - fadeDuration;

      if (isFirst) {
        // Escena 0 (Welcome): aparece al inicio, se mantiene, desaparece
        sceneTimeline
          .to(scene, {
            opacity: 1,
            y: 0,
            duration: segmentDuration,
            ease: "none",
            pointerEvents: "auto",
          })
          .to(scene, {
            opacity: 0,
            y: -50,
            duration: fadeDuration,
            ease: "none",
            pointerEvents: "none",
          });
      } else if (isLast) {
        // Última escena: aparece y se queda
        sceneTimeline
          .fromTo(
            scene,
            { opacity: 0, y: 50, pointerEvents: "none" },
            {
              opacity: 1,
              y: 0,
              duration: fadeDuration,
              ease: "none",
              pointerEvents: "auto",
            },
          )
          .to(scene, {
            opacity: 1,
            y: 0,
            duration: segmentDuration,
            ease: "none",
            pointerEvents: "auto",
          });
      } else {
        // Escenas intermedias: aparecen, se mantienen, desaparecen
        sceneTimeline
          .fromTo(
            scene,
            { opacity: 0, y: 50, pointerEvents: "none" },
            {
              opacity: 1,
              y: 0,
              duration: fadeDuration,
              ease: "none",
              pointerEvents: "auto",
            },
          )
          .to(scene, {
            opacity: 1,
            y: 0,
            duration: segmentDuration,
            ease: "none",
            pointerEvents: "auto",
          })
          .to(scene, {
            opacity: 0,
            y: -50,
            duration: fadeDuration,
            ease: "none",
            pointerEvents: "none",
          });
      }
    });

    let lastFrame = -1;

    ScrollTrigger.create({
      trigger: containerRef.value,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.max(0, Math.round(self.progress * (frameCount - 1))),
        );

        if (frameIndex === lastFrame) return;
        lastFrame = frameIndex;

        const image = images[frameIndex];
        if (!image) return;
        drawFn(image, context, canvas);
      },
    });
  };

  const cleanup = () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };

  return {
    currentScene,
    setupAnimation,
    cleanup,
  };
}