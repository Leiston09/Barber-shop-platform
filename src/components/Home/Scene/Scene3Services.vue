<!-- components/Home/Scene3Services.vue -->

<template>
  <div class="absolute inset-0 flex items-center pointer-events-none">
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-10">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-16 items-center">

        <div class="relative h-[52vh] max-h-[540px]">

          <div
            class="absolute left-[4%] top-0 w-[47%] h-[82%] overflow-hidden"
          >
            <img
              src="/img/barbers/barber1.jpg"
              alt="Barbero trabajando"
              class="w-full h-full object-cover"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
            />

            <div class="absolute bottom-5 left-5">
              <p class="text-white text-base sm:text-lg font-serif italic">
                Donde cada detalle cuenta.
              </p>
            </div>
          </div>

          <div
            class="absolute right-[4%] top-[18%] w-[47%] h-[82%] overflow-hidden"
          >
            <img
              src="/img/barbers/barber2.jpg"
              alt="Barbero trabajando"
              class="w-full h-full object-cover"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
            />

            <div class="absolute bottom-5 left-5">
              <p class="text-white text-base sm:text-lg font-serif italic">
                Tu estilo, en buenas manos.
              </p>
            </div>
          </div>

        </div>

        <div class="max-w-lg">
          <p class="text-[#ffb700] text-[9px] uppercase tracking-[0.3em] font-medium">
            03 / El equipo
          </p>

          <h2
            class="mt-4 font-barber uppercase text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[0.92] tracking-[-0.03em]"
          >
            ENCUENTRA
            <br />
            TU CORTE.
            <br />
            <span class="text-[#ffb700]">ENCUENTRA TU BARBERO.</span>
          </h2>

          <p
            class="mt-5 text-white/60 text-xs sm:text-sm leading-6 font-light max-w-[380px]"
          >
            No todos buscan lo mismo. Por eso cada barbero tiene
            su propia forma de trabajar, interpretar tu idea y
            convertirla en un resultado que vaya contigo.
          </p>

          <p class="mt-4 text-white/35 text-[11px] sm:text-xs italic">
            Tú eliges el estilo. Nosotros ponemos la experiencia.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>