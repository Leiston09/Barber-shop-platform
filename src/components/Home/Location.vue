
<template>
  <section class="w-full bg-[#0a0a0a] text-white py-10 px-6 sm:px-10 lg:px-15 border-t border-white/[0.06]">
    <div class="max-w-7xl mx-auto">
      <!-- ENCABEZADO -->
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-[#ffb700] text-[10px] uppercase tracking-[0.25em] font-semibold">
            Ubicación
          </span>
        </div>

        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-barber font-light text-white leading-[1.05] tracking-tight">
          Encuéntranos
        </h2>

        <p class="text-white/45 text-sm font-light mt-4 max-w-md leading-relaxed">
          Visítanos y descubre una experiencia pensada para cada detalle.
        </p>
      </div>

      <!-- CONTENIDO -->
      <div class="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-10 lg:gap-14 items-start">

        <!-- MAPA -->
        <a
          href="https://www.google.com/maps/place/Pedro+Carbo,+Ecuador"
          target="_blank"
          rel="noopener noreferrer"
          class="relative block w-full h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden rounded-md border border-white/10 group"
        >
          <img
            src="/img/home/mapa.png"
            alt="Ubicación The Barber Studio — Pedro Carbo, Ecuador"
            class="w-full h-full object-cover grayscale-[0.45] transition-transform duration-500 group-hover:scale-[1.03]"
          />

          <!-- Overlay -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span class="inline-flex items-center gap-3 text-white text-[10px] uppercase tracking-[0.15em] border border-white/40 bg-black/30 px-5 py-3 rounded-md">
              Abrir en Google Maps
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 17 17 7M8 7h9v9" />
              </svg>
            </span>
          </div>

          <!-- Etiqueta -->
          <div class="absolute bottom-4 left-4 bg-[#0a0a0a]/90 px-3 py-2 border border-white/10 rounded-sm">
            <span class="text-white/75 text-[9px] uppercase tracking-[0.15em] font-medium">
              The Barber Studio
            </span>
          </div>
        </a>

        <!-- INFORMACIÓN -->
        <div class="space-y-7">

          <!-- DIRECCIÓN -->
          <div>
            <span class="text-[#ffb700] text-[10px] uppercase tracking-[0.2em] font-semibold">
              Dirección
            </span>

            <p class="font-barber text-white/90 text-lg font-light mt-2">
              Pedro Carbo, Guayas
            </p>

            <p class="text-white/40 text-xs mt-1">Ecuador</p>

            <p class="text-white/45 text-xs mt-3">
              Entre Av. Principal y Calle 2
            </p>
          </div>

          <!-- HORARIO -->
          <div class="pt-6 border-t border-white/10">
            <span class="text-[#ffb700] text-[10px] uppercase tracking-[0.2em] font-semibold">
              Horario
            </span>

            <div class="mt-4 space-y-3">
              <div class="flex justify-between gap-4 text-sm">
                <span class="text-white/50 font-light">Lunes — Viernes</span>
                <span class="text-white/80 font-medium tabular-nums">09:00 — 20:00</span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-white/50 font-light">Sábados</span>
                <span class="text-white/80 font-medium tabular-nums">10:00 — 18:00</span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-white/30 font-light">Domingos</span>
                <span class="text-white/30 font-light">Cerrado</span>
              </div>
            </div>
          </div>

          <!-- CONTACTO -->
          <div class="pt-6 border-t border-white/10">
            <span class="text-[#ffb700] text-[10px] uppercase tracking-[0.2em] font-semibold">
              Contacto
            </span>

            <div class="mt-3 space-y-2">
              <a
                href="tel:+593999999999"
                class="block w-fit text-white/55 text-sm font-light hover:text-[#ffb700] transition-colors duration-200"
              >
                +593 99 999 9999
              </a>

              <a
                href="mailto:info@thebarberstudio.com"
                class="block w-fit text-white/55 text-sm font-light hover:text-[#ffb700] transition-colors duration-200"
              >
                info@thebarberstudio.com
              </a>
            </div>
          </div>

          <!-- REFERENCIA -->
          <div class="pt-5 border-t border-white/10">
            <span class="text-white/30 text-[9px] uppercase tracking-[0.15em] font-light">
              Referencia: Esquina con Av. Principal
            </span>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
