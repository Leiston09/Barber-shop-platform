<template>
  <section class="home-story relative w-full bg-[#090909] text-white">
    <div ref="containerRef" class="home-story-scroll relative w-full">
      <div class="home-story-frame sticky top-0 w-full overflow-hidden [container-type:size]">
        <!-- VIDEO (con poster fallback) -->
        <video
          ref="videoRef"
          src="/frames_webp/peluqueria.mp4"
          :poster="media.url('home-poster') || undefined"
          autoplay
          muted
          playsinline
          loop
          preload="auto"
          class="absolute inset-0 z-0 w-full h-full object-cover"
        />

        <!-- OVERLAYS -->
        <div
          class="absolute inset-0 z-[3] bg-gradient-to-t from-black/90 via-black/30 to-black/50 pointer-events-none"
        />
        <div
          class="absolute inset-0 z-[3] bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none"
        />

        <SidebarIndicator :currentScene="currentScene" />

        <!-- SCENES -->
        <div
          ref="sceneLayerRef"
          class="absolute inset-0 z-10 pointer-events-none opacity-0 [@container(max-height:700px)]:[&>[data-scene]]:pt-[calc(var(--app-header-height)+1rem)] [@container(max-height:700px)]:[&>[data-scene]]:pb-[calc(var(--app-mobile-nav-clearance)+1rem)] [@container(max-height:700px)]:[&>[data-scene]>div]:max-h-full [@container(max-height:700px)]:[&>[data-scene]>div]:overflow-y-auto [&>[data-scene]>div]:[scrollbar-width:none] [&>[data-scene]>div::-webkit-scrollbar]:hidden [@container(max-height:700px)]:[&>[data-scene]>div]:pointer-events-auto [@container(max-height:700px)]:[&>[data-scene]>div]:py-0!"
        >
          <SceneWelcome data-scene />
          <Scene1Hero data-scene />
          <Scene2Team data-scene />
          <Scene3Services data-scene />
          <Scene4CTA data-scene />
        </div>

        <!-- SCROLL INDICATOR -->
        <div
          v-if="currentScene < 1"
          class="home-scroll-indicator absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-60 pointer-events-none"
        >
          <span
            class="text-xs tracking-[0.12em] text-slate-300 mb-3 font-light"
          >
            Desliza para descubrir
          </span>
          <div
            class="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center p-1.5 motion-safe:animate-bounce"
          >
            <div class="w-1 h-2 bg-amber-400 rounded-full motion-safe:animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSiteMediaStore } from "@/stores/siteMedia";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

import SidebarIndicator from "@/components/Navbar/SidebarIndicator.vue";
import SceneWelcome from "@/components/Home/Scene/SceneWelcome.vue";
import Scene1Hero from "@/components/Home/Scene/Scene1Hero.vue";
import Scene2Team from "@/components/Home/Scene/Scene2Team.vue";
import Scene3Services from "@/components/Home/Scene/Scene3Services.vue";
import Scene4CTA from "@/components/Home/Scene/Scene4CTA.vue";

import { useScrollAnimation } from "@/composables/Home/useScrollAnimation";
import { useSceneStore } from "@/stores/navbar/currentScene";

const media = useSiteMediaStore();
const containerRef = ref<HTMLElement | null>(null);
const sceneLayerRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);

const { currentScene, setupAnimation, cleanup } = useScrollAnimation(
  containerRef,
  sceneLayerRef,
);

const currentScenes = useSceneStore();

watch(currentScene, (val) => {
  currentScenes.setScene(val);
});

onMounted(() => {
  // 1. Arrancar las escenas inmediatamente (sin esperar al video)
  setupAnimation();
  currentScenes.setScene(currentScene.value);

  // 2. Intentar reproducir el video en background (no bloquea nada)
  const video = videoRef.value;
  if (video) {
    video.play().catch(() => {
      // Si falla, el poster se queda visible como fallback
    });
  }

});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.home-story {
  --home-viewport: var(--app-viewport);
  margin-block-start: calc(0px - var(--app-header-height));
}

/* Recorrido m?s corto en m?vil, sin interceptar el deslizamiento t?ctil. */
.home-story-scroll {
  height: 500vh;
  height: calc(var(--home-viewport) + 4 * var(--home-scene-step, 100svh));
}

.home-story-frame {
  height: var(--home-viewport);
}

/* Ajustar el encuadre suavemente cuando cambia el espacio visible. */
@media (max-width: 1023px), (pointer: coarse) {
  .home-story-frame,
  .home-story-scroll {
    transition: height 360ms ease-out;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-story-frame,
  .home-story-scroll {
    transition: none;
  }
}

.home-scroll-indicator {
  bottom: calc(var(--app-mobile-nav-clearance) + 0.5rem);
}


video {
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

img {
  user-select: none;
  -webkit-user-drag: none;
}
</style>
