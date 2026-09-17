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
  const frameCount = 826;

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
          // ✅ currentScene a 0 al cargar
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
      const isLast = index === scenes.length - 1;

      if (index === 0) {
        sceneTimeline
          .to(scene, {
            opacity: 1,
            y: 0,
            duration: 0.05,
            ease: "none",
            pointerEvents: "auto",
          })
          .to(scene, {
            opacity: 1,
            y: 0,
            duration: 0.1,
            ease: "none",
            pointerEvents: "auto",
          })
          .to(scene, {
            opacity: 0,
            y: -50,
            duration: 0.05,
            ease: "none",
            pointerEvents: "none",
          });
      } else if (isLast) {
        sceneTimeline
          .fromTo(
            scene,
            { opacity: 0, y: 50, pointerEvents: "none" },
            {
              opacity: 1,
              y: 0,
              duration: 0.12,
              ease: "none",
              pointerEvents: "auto",
            },
            "-=0.04",
          )
          .to(scene, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "none",
            pointerEvents: "auto",
          });
      } else {
        sceneTimeline
          .fromTo(
            scene,
            { opacity: 0, y: 50, pointerEvents: "none" },
            {
              opacity: 1,
              y: 0,
              duration: 0.12,
              ease: "none",
              pointerEvents: "auto",
            },
            "-=0.04",
          )
          .to(scene, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "none",
            pointerEvents: "auto",
          })
          .to(scene, {
            opacity: 0,
            y: -50,
            duration: 0.12,
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