<template>
  <section class="w-full bg-[#0a0a0a] text-white py-10 px-6 sm:px-10 lg:px-15 border-t border-white/[0.06]">
    <div class="max-w-7xl mx-auto">
      <!-- ENCABEZADO -->
      <div class="mb-14">
        <div class="flex items-center gap-3 mb-5">
          <span class="w-8 h-px bg-[#ffb700]" />
          <span class="text-[#ffb700] text-[10px] uppercase tracking-[0.3em] font-medium">
            Ubicación
          </span>
        </div>
        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-barber font-light text-white leading-[1.05] tracking-tight">
          Encuéntranos
        </h2>
        <p class="text-white/40 text-sm font-light mt-4 max-w-md leading-relaxed">
          Visítanos y descubre una experiencia pensada para cada detalle.
        </p>
      </div>

      <!-- CONTENIDO -->
      <div class="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-16 items-start">
        
        <!-- MAPA (imagen estática clickeable) -->
        <a
          href="https://www.google.com/maps/place/Pedro+Carbo,+Ecuador"
          target="_blank"
          rel="noopener noreferrer"
          class="relative block w-full h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden border border-white/10 rounded-sm group"
        >
          <img
            src="/img/home/mapa.png"
            alt="Ubicación The Barber Studio — Pedro Carbo, Ecuador"
            class="w-full h-full object-cover grayscale-[0.6] transition-transform duration-500 group-hover:scale-105"
          />

          <!-- Overlay al hacer hover -->
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span class="text-white text-[10px] uppercase tracking-[0.25em] border border-white/40 px-5 py-2.5">
              Abrir en Google Maps →
            </span>
          </div>

          <!-- Etiqueta inferior -->
          <div class="absolute bottom-5 left-5 bg-black/60 backdrop-blur-sm px-4 py-2 border border-white/10">
            <span class="text-white/60 text-[9px] uppercase tracking-[0.2em] font-light">
              The Barber Studio
            </span>
          </div>
        </a>

        <!-- INFORMACIÓN -->
        <div class="space-y-8">
          <!-- DIRECCIÓN -->
          <div>
            <span class="text-[#ffb700] text-[9px] uppercase tracking-[0.3em] font-medium">
              Dirección
            </span>
            <p class="font-barber text-white/80 text-lg font-light mt-2">
              Pedro Carbo, Guayas
            </p>
            <p class="text-white/30 text-xs mt-0.5">Ecuador</p>
            <p class="text-white/40 text-xs mt-3">
              Entre Av. Principal y Calle 2
            </p>
          </div>

          <!-- HORARIO -->
          <div class="pt-6 border-t border-white/10">
            <span class="text-[#ffb700] text-[9px] uppercase tracking-[0.3em] font-medium">
              Horario
            </span>
            <div class="mt-3 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-white/40 font-light">Lunes — Viernes</span>
                <span class="text-white/60 font-light">09:00 — 20:00</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-white/40 font-light">Sábados</span>
                <span class="text-white/60 font-light">10:00 — 18:00</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-white/25 font-light">Domingos</span>
                <span class="text-white/25 font-light">Cerrado</span>
              </div>
            </div>
          </div>

          <!-- CONTACTO -->
          <div class="pt-6 border-t border-white/10">
            <span class="text-[#ffb700] text-[9px] uppercase tracking-[0.3em] font-medium">
              Contacto
            </span>
            <div class="mt-3 space-y-1.5">
              <a href="tel:+593999999999" class="block text-white/50 text-sm font-light hover:text-white transition-colors duration-300">
                +593 99 999 9999
              </a>
              <a href="mailto:info@thebarberstudio.com" class="block text-white/50 text-sm font-light hover:text-white transition-colors duration-300">
                info@thebarberstudio.com
              </a>
            </div>
          </div>

          <!-- REFERENCIA -->
          <div class="pt-6 border-t border-white/10">
            <span class="text-white/20 text-[8px] uppercase tracking-[0.3em] font-light">
              Referencia: Esquina con Av. Principal
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>