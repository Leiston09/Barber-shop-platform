<template>
  <div
    ref="sectionRef"
    class="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-5 overflow-hidden"
  >
    <div class="w-full max-w-5xl mx-auto">
      <div class="text-center mb-5">
        <p
          data-anim
          class="text-[#ffb700]/80 text-[9px] uppercase tracking-[0.3em] font-medium"
        >
          The Barber Studio
        </p>

        <h1
          data-anim
          class="mt-2 font-barber uppercase text-4xl sm:text-5xl lg:text-6xl text-white/90 font-semibold leading-[0.9] tracking-[-0.03em]"
        >
          Elige tu
          <span class="text-[#ffb700]">estilo.</span>
        </h1>

        <p
          data-anim
          class="text-white/35 text-xs sm:text-sm font-light mt-3 max-w-md mx-auto leading-relaxed"
        >
          Selecciona el servicio que quieres reservar para continuar.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        <!-- BARBERÍA (entra desde la IZQUIERDA) -->
        <RouterLink
          data-card-left
          :to="{ name: 'Reservaciones' }"
          class="group relative h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-white/10 hover:border-[#ffb700]/35 transition-all duration-500 bg-gradient-to-br from-[#1a1408] via-[#0d0d0d] to-black"
        >
          <img
            src="/img/services/barberia.png"
            alt="Barbería"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0')"
          />

          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
          />

          <div
            class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          <div class="absolute inset-x-0 bottom-0 p-7 text-center">
            <p
              class="text-[#ffb700]/80 text-[8px] uppercase tracking-[0.3em] font-medium mb-2"
            >
              Barbería
            </p>

            <h2
              class="font-barber uppercase text-3xl sm:text-4xl text-white/90 font-semibold leading-[0.9] tracking-[-0.025em]"
            >
              Corte y
              <span class="text-[#ffb700]">estilo</span>
            </h2>

            <p
              class="text-white/45 text-xs sm:text-sm font-light mt-3 max-w-sm mx-auto leading-relaxed"
            >
              Cortes, barba, afeitado clásico y asesoría de imagen.
            </p>

            <span
              class="inline-block mt-5 text-white/55 text-[8px] uppercase tracking-[0.25em] transition-colors duration-300 group-hover:text-[#ffb700]"
            >
              Reservar servicio
            </span>
          </div>
        </RouterLink>

        <!-- TATUAJES (DESHABILITADO — entra desde la DERECHA) -->
        <button
          type="button"
          data-card-right
          @click="handleTatuajesClick"
          class="group relative h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-white/10 hover:border-[#ffb700]/35 transition-all duration-500 bg-gradient-to-br from-[#1a1408] via-[#0d0d0d] to-black cursor-not-allowed text-left"
        >
          <img
            src="/img/services/tatuajes.png"
            alt="Tatuajes"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 opacity-60 group-hover:scale-105"
            @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0')"
          />

          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
          />

          <div
            class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          <!-- BADGE "PRÓXIMAMENTE" -->
          <div
            class="absolute top-4 right-4 bg-black/70 backdrop-blur-sm border border-[#ffb700]/30 px-3 py-1.5 rounded-full"
          >
            <span
              class="text-[#ffb700] text-[8px] uppercase tracking-[0.25em] font-medium"
            >
              Próximamente
            </span>
          </div>

          <div class="absolute inset-x-0 bottom-0 p-7 text-center">
            <p
              class="text-[#ffb700]/80 text-[8px] uppercase tracking-[0.3em] font-medium mb-2"
            >
              Tatuajes
            </p>

            <h2
              class="font-barber uppercase text-3xl sm:text-4xl text-white/90 font-semibold leading-[0.9] tracking-[-0.025em]"
            >
              Tinta y
              <span class="text-[#ffb700]">detalle</span>
            </h2>

            <p
              class="text-white/45 text-xs sm:text-sm font-light mt-3 max-w-sm mx-auto leading-relaxed"
            >
              Diseño personalizado, línea fina, blackwork y color.
            </p>

            <span
              class="inline-block mt-5 text-white/55 text-[8px] uppercase tracking-[0.25em] transition-colors duration-300 group-hover:text-[#ffb700]"
            >
              Reservar servicio
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useToast } from "vue-toast-notification";
import { useRevealOnScroll } from "@/composables/useRevealOnScroll";

const sectionRef = ref<HTMLElement | null>(null);
const toast = useToast();

// Card de tatuajes deshabilitada — muestra advertencia
const handleTatuajesClick = () => {
  toast.open({
    message: "Esta función está en mantenimiento",
    type: "warning",
    duration: 3000,
  });
};

// 1) Encabezado → fade + subir (comportamiento default)
useRevealOnScroll(sectionRef);

// 2) Card izquierda → entra desde la IZQUIERDA
useRevealOnScroll(sectionRef, {
  selector: "[data-card-left]",
  y: 0,
  x: -150,
  duration: 1.1,
  stagger: 0,
  start: "top 75%",
  ease: "power3.out",
});

// 3) Card derecha → entra desde la DERECHA
useRevealOnScroll(sectionRef, {
  selector: "[data-card-right]",
  y: 0,
  x: 150,
  duration: 1.1,
  stagger: 0,
  start: "top 75%",
  ease: "power3.out",
});
</script>

<style scoped>
img {
  user-select: none;
  -webkit-user-drag: none;
}
</style>