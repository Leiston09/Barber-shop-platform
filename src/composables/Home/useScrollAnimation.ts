import { ref, type Ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(
  containerRef: Ref<HTMLElement | null>,
  sceneLayerRef: Ref<HTMLElement | null>,
) {
  const currentScene = ref(0);

  let masterTrigger: ScrollTrigger | null = null;
  let sceneTimelines: gsap.core.Timeline[] = [];
  let activeIndex = -1;
  let pendingPlay: gsap.core.Tween | null = null;
  let sceneRanges: number[] = [];

  const setupAnimation = () => {
    if (!containerRef.value || !sceneLayerRef.value) return;

    const scenes = Array.from(
      sceneLayerRef.value.querySelectorAll<HTMLElement>("[data-scene]"),
    );

    if (!scenes.length) return;

    const sceneCount = scenes.length;

    // =========================================================
    // 📐 Distribución del scroll
    // - Welcome (índice 0) ocupa la MITAD que las demás
    // - Todas las demás ocupan lo mismo
    // =========================================================
    const durations: number[] = scenes.map((_, i) =>
      i === 0 ? 0.5 : 1,
    );
    const totalWeight = durations.reduce((a, b) => a + b, 0);

    let acc = 0;
    sceneRanges = durations.map((d) => {
      acc += d / totalWeight;
      return acc;
    });
    // Ejemplo con 5 escenas: [0.111, 0.333, 0.555, 0.777, 1.0]

    // Helper para saber qué escena corresponde a un progreso dado
    const getSceneIndex = (progress: number): number => {
      for (let i = 0; i < sceneRanges.length; i++) {
        if (progress < (sceneRanges[i] ?? 1)) return i;
      }
      return sceneCount - 1;
    };

    gsap.set(sceneLayerRef.value, { opacity: 1 });

    // =========================================================
    // 🎬 Timeline POR ESCENA
    // - Escena 0 (Welcome): entrada directa (sin slide), solo fade-out
    // - Escenas 1, 2, 3: entrada con slide + stagger, salida con reverse
    // - Escena 4 (última): entrada con slide, sin salida
    // =========================================================
    sceneTimelines = scenes.map((scene, index) => {
      const marked = scene.querySelectorAll<HTMLElement>("[data-anim]");
      const targets: HTMLElement[] = marked.length
        ? Array.from(marked)
        : (Array.from(scene.children) as HTMLElement[]);

      const isFirst = index === 0;

      gsap.set(scene, { opacity: 0, pointerEvents: "none" });

      if (isFirst) {
        gsap.set(targets, { opacity: 1, y: 0 });
      } else {
        gsap.set(targets, { opacity: 0, y: 60 });
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      });

      tl.to(scene, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.15,
      });

      if (!isFirst) {
        tl.to(
          targets,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.18,
          },
          "<0.05",
        );
      }

      return tl;
    });

    // =========================================================
    // 🎯 Master ScrollTrigger
    // =========================================================
    masterTrigger = ScrollTrigger.create({
      trigger: containerRef.value,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        if (pendingPlay) {
          pendingPlay.kill();
          pendingPlay = null;
        }

        const idx = getSceneIndex(self.progress);

        currentScene.value = idx;

        sceneTimelines.forEach((tl) => tl.pause(0));

        const activeTl = sceneTimelines[idx];
        if (activeTl) {
          activeTl.play();
          activeIndex = idx;
        }
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const sceneIndex = getSceneIndex(progress);

        currentScene.value = sceneIndex;

        if (sceneIndex === activeIndex) return;

        if (pendingPlay) {
          pendingPlay.kill();
          pendingPlay = null;
        }

        sceneTimelines.forEach((tl, i) => {
          if (i !== sceneIndex) {
            tl.timeScale(3).reverse();
          }
        });

        const nextTl = sceneTimelines[sceneIndex];
        if (nextTl) {
          nextTl.timeScale(1);
          pendingPlay = gsap.delayedCall(0.15, () => {
            nextTl.play();
            pendingPlay = null;
          });
        }

        activeIndex = sceneIndex;
      },
    });

    // Arrancar la primera escena al cargar
    const firstTl = sceneTimelines[0];
    if (firstTl) {
      firstTl.play();
      activeIndex = 0;
      currentScene.value = 0;
    }
  };

  const cleanup = () => {
    if (pendingPlay) {
      pendingPlay.kill();
      pendingPlay = null;
    }
    sceneTimelines.forEach((tl) => tl.kill());
    sceneTimelines = [];
    masterTrigger?.kill();
    masterTrigger = null;
    activeIndex = -1;
    sceneRanges = [];
  };

  return {
    currentScene,
    setupAnimation,
    cleanup,
  };
}