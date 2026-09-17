<template>
  <div
    class="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-5"
  >
    <div class="w-full max-w-5xl mx-auto">
      <div class="text-center mb-5">
        <p
          class="text-[#ffb700]/80 text-[9px] uppercase tracking-[0.3em] font-medium"
        >
          The Barber Studio
        </p>

        <h1
          class="mt-2 font-barber uppercase text-4xl sm:text-5xl lg:text-6xl text-white/90 font-semibold leading-[0.9] tracking-[-0.03em]"
        >
          Elige tu
          <span class="text-[#ffb700]">estilo.</span>
        </h1>

        <p
          class="text-white/35 text-xs sm:text-sm font-light mt-3 max-w-md mx-auto leading-relaxed"
        >
          Selecciona el servicio que quieres reservar para continuar.
        </p>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto"
      >
        <!-- BARBERÍA -->
        <RouterLink
          :to="{ name: 'Reservaciones' }"
          class="group relative h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-white/10 hover:border-[#ffb700]/35 transition-all duration-500 bg-gradient-to-br from-[#1a1408] via-[#0d0d0d] to-black"
        >
          <!-- IMAGEN CON FALLBACK -->
          <img
            src="/img/services/barberia.png"
            alt="Barbería"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0')"
          />

          <!-- VELO OSCURO -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
          />

          <!-- LÍNEA DORADA SUPERIOR -->
          <div
            class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          <!-- CONTENIDO -->
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

        <!-- TATUAJES -->
        <RouterLink
          :to="{ name: '' }"
          class="group relative h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-white/10 hover:border-[#ffb700]/35 transition-all duration-500 bg-gradient-to-br from-[#1a1408] via-[#0d0d0d] to-black"
        >
          <img
            src="/img/services/tatuajes.png"
            alt="Tatuajes"
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
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped></style>