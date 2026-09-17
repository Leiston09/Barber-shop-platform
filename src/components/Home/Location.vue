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
        
        <!-- MAPA -->
        <div class="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden border border-white/10 rounded-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7595!2d-80.2298!3d-1.5535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902d2e1e8f9f9f9f%3A0x5b5b5b5b5b5b5b5b!2sPedro%20Carbo%2C%20Ecuador!5e0!3m2!1ses!2s!4v1700000000000!5m2!1ses!2s"
            width="100%"
            height="100%"
            style="border:0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="w-full h-full grayscale-[0.6]"
          />
          <div class="absolute bottom-5 left-5 bg-black/60 backdrop-blur-sm px-4 py-2 border border-white/10">
            <span class="text-white/60 text-[9px] uppercase tracking-[0.2em] font-light">
              The Barber Studio
            </span>
          </div>
        </div>

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