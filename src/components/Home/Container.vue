<template>
  <section class="relative w-full bg-[#090909] text-white -mt-[60px]">
    <div ref="containerRef" class="relative h-[500vh] w-full">
      <div class="sticky top-0 h-screen w-full overflow-hidden">
        <!-- VIDEO -->
        <video
          ref="videoRef"
          src="/frames_webp/peluqueria.mp4"
          autoplay
          muted
          playsinline
          loop
          preload="auto"
          class="absolute inset-0 z-0 w-full h-full object-cover"
        />

        <!-- GIF DE CARGA -->
        <img
          v-if="isLoading"
          src="/frames_webp/gif/peluqueria.gif"
          alt="Cargando"
          class="absolute inset-0 z-[2] w-full h-full object-cover"
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
          class="absolute inset-0 z-10 pointer-events-none opacity-0"
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
          class="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-60 pointer-events-none"
        >
          <span
            class="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3 font-light animate-bounce"
          >
            Scroll
          </span>
          <div
            class="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center p-1.5 animate-bounce"
          >
            <div class="w-1 h-2 bg-amber-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SidebarIndicator from "@/components/Navbar/SidebarIndicator.vue";
import SceneWelcome from "@/components/Home/Scene/SceneWelcome.vue";
import Scene1Hero from "@/components/Home/Scene/Scene1Hero.vue";
import Scene2Team from "@/components/Home/Scene/Scene2Team.vue";
import Scene3Services from "@/components/Home/Scene/Scene3Services.vue";
import Scene4CTA from "@/components/Home/Scene/Scene4CTA.vue";

import { useScrollAnimation } from "@/composables/Home/useScrollAnimation";
import { useSceneStore } from "@/stores/navbar/currentScene";

const containerRef = ref<HTMLElement | null>(null);
const sceneLayerRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);

const isLoading = ref(true);

const { currentScene, setupAnimation, cleanup } = useScrollAnimation(
  containerRef,
  sceneLayerRef,
);

const currentScenes = useSceneStore();

watch(currentScene, (val) => {
  currentScenes.setScene(val);
});

onMounted(async () => {
  const video = videoRef.value;
  if (!video) return;

  await new Promise<void>((resolve) => {
    if (video.readyState >= 2) {
      resolve();
    } else {
      video.addEventListener("canplay", () => resolve(), { once: true });
    }
  });

  try {
    await video.play();
  } catch {
    /* ignorar */
  }

  setupAnimation();
  currentScenes.setScene(0);
  isLoading.value = false;

  // ✅ Recalcular medidas después de montar
  // El onRefresh se encarga de reproducir la escena correcta
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
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