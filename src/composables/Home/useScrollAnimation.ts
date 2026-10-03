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

  const setupAnimation = () => {
    if (!containerRef.value || !sceneLayerRef.value) return;

    const scenes = Array.from(
      sceneLayerRef.value.querySelectorAll<HTMLElement>("[data-scene]"),
    );

    if (!scenes.length) return;

    gsap.set(sceneLayerRef.value, { opacity: 1 });

    // =========================================================
    // 🎬 Timeline POR ESCENA (autónoma, sin scrub)
    // =========================================================
    sceneTimelines = scenes.map((scene) => {
      const marked = scene.querySelectorAll<HTMLElement>("[data-anim]");
      const targets: HTMLElement[] = marked.length
        ? Array.from(marked)
        : (Array.from(scene.children) as HTMLElement[]);

      gsap.set(scene, { opacity: 0, pointerEvents: "none" });
      gsap.set(targets, { opacity: 0, y: 60 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      });

      tl.to(scene, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.15,
      }).to(
        targets,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.18,
        },
        "<0.05",
      );

      return tl;
    });

    // =========================================================
    // 🎯 Master ScrollTrigger: SOLO decide qué escena está activa
    // =========================================================
    masterTrigger = ScrollTrigger.create({
      trigger: containerRef.value,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        // Cancelar cualquier delayedCall pendiente
        if (pendingPlay) {
          pendingPlay.kill();
          pendingPlay = null;
        }

        // Detectar la escena correspondiente al progreso actual
        const idx = Math.min(
          scenes.length - 1,
          Math.max(0, Math.floor(self.progress * scenes.length)),
        );

        currentScene.value = idx;

        // Resetear TODAS las escenas al estado inicial
        sceneTimelines.forEach((tl) => tl.pause(0));

        // ✅ Reproducir inmediatamente la escena correcta
        //    (sin esto, al recargar quedaba todo invisible)
        const activeTl = sceneTimelines[idx];
        if (activeTl) {
          activeTl.play();
          activeIndex = idx;
        }
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const sceneIndex = Math.min(
          scenes.length - 1,
          Math.floor(progress * scenes.length),
        );

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

    // =========================================================
    // Arrancar la primera escena al cargar la página
    // =========================================================
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
  };

  return {
    currentScene,
    setupAnimation,
    cleanup,
  };
}