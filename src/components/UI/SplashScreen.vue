<!-- src/components/UI/SplashScreen.vue -->

<template>
  <div
    class="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
  >
    <!-- FONDO CON IMAGEN -->
    <div
      class="absolute inset-0 z-0"
      style="
        background-image: url('/img/auth/login.jpg');
        background-size: cover;
        background-position: center;
      "
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-black/60"
      />
    </div>

    <!-- HALO DORADO -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#ffb700]/[0.06] blur-[120px] pointer-events-none"
    />

    <!-- CONTENIDO -->
    <div class="relative z-10 flex flex-col items-center">
      <!-- LOGO -->
      <div
        class="w-16 h-16 border border-white/20 flex items-center justify-center mb-6 overflow-hidden"
      >
        <img
          src="/img/navbar/profile.png"
          alt="Logo"
          class="w-full h-full object-cover"
        />
      </div>

      <p class="text-[16px] tracking-[0.32em] font-medium text-white/90">
        STUDIO
      </p>
      <p class="text-[9px] tracking-[0.42em] text-[#ffb700] mt-1.5">
        SILHOUETTE
      </p>

      <!-- LABEL -->
      <div class="flex items-center gap-3 mt-8">
        <span class="w-8 h-px bg-[#ffb700]/40" />
        <span
          class="text-[9px] uppercase tracking-[0.35em] text-white/40 font-medium"
        >
          {{ loadingText }}
        </span>
        <span class="w-8 h-px bg-[#ffb700]/40" />
      </div>

      <!-- BARRA -->
      <div class="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden mt-8">
        <div
          class="h-full bg-[#ffb700] rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <!-- PUNTOS -->
      <div class="flex items-center gap-1.5 mt-5">
        <span
          v-for="i in 3"
          :key="i"
          class="w-1 h-1 rounded-full bg-[#ffb700]/60"
          :style="{
            animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
          }"
        />
      </div>
    </div>

    <!-- FOOTER -->
    <div class="absolute bottom-8 left-0 right-0 text-center z-10">
      <p class="text-[8px] uppercase tracking-[0.4em] text-white/15 font-light">
        Estilo · Precisión · Confianza
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const progress = ref(0);
const loadingText = ref("Iniciando");

const texts = [
  "Iniciando",
  "Verificando sesión",
  "Cargando datos",
  "Preparando tu experiencia",
];

let textInterval: number | undefined;
let progressInterval: number | undefined;

onMounted(() => {
  let textIndex = 0;

  textInterval = window.setInterval(() => {
    textIndex = (textIndex + 1) % texts.length;
    loadingText.value = texts[textIndex] ?? "Cargando";
  }, 1300);

  progressInterval = window.setInterval(() => {
    if (progress.value < 92) {
      progress.value += Math.random() * 6 + 2;
      if (progress.value > 92) progress.value = 92;
    }
  }, 180);
});

import { onUnmounted } from "vue";

onUnmounted(() => {
  if (textInterval) clearInterval(textInterval);
  if (progressInterval) clearInterval(progressInterval);
});
</script>

<style scoped>
@keyframes pulse-dot {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}
</style>