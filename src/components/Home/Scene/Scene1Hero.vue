<!-- components/Home/Scene1Hero.vue -->

<template>
  <div class="absolute inset-0 flex items-center pointer-events-none">
    <div
      class="w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 pt-20 pb-32 sm:pt-24 sm:pb-28 lg:pt-24 lg:pb-16"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20 items-center"
      >
        <!-- IMAGEN -->
        <div class="flex justify-center">
          <div
            class="relative w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[300px] aspect-[4/5] overflow-hidden"
          >
            <img
              src="/img/home/chaleco.jpg"
              alt="Barbero trabajando"
              class="w-full h-full object-cover"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
            />

            <div
              class="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5"
            >
              <p
                class="text-[#ffb700] text-[8px] sm:text-[9px] uppercase tracking-[0.3em]"
              >
                Sin atajos
              </p>

              <p
                class="mt-1.5 sm:mt-2 text-white text-sm sm:text-base lg:text-lg font-serif italic leading-snug"
              >
                La diferencia está en cómo lo hacemos.
              </p>
            </div>
          </div>
        </div>

        <!-- TEXTO -->
        <div class="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <p
            class="text-[#ffb700] text-[10px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] font-medium"
          >
            01 / El oficio
          </p>

          <h2
            class="mt-3 sm:mt-4 lg:mt-5 font-barber uppercase text-white text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-[0.9] tracking-[-0.03em]"
          >
            TU ESTILO
            <br />
            COMIENZA
            <br />
            <span class="text-[#ffb700]">AQUÍ.</span>
          </h2>

          <p
            class="mt-4 sm:mt-5 lg:mt-6 text-white/60 text-sm sm:text-base leading-6 sm:leading-7 font-light max-w-[430px] mx-auto lg:mx-0"
          >
            Cada persona tiene una forma distinta de llevar su estilo.
            Nosotros nos encargamos de entenderla, trabajarla y llevarla
            a un resultado que realmente se sienta tuyo.
          </p>

          <p
            class="mt-3 sm:mt-4 lg:mt-4 text-white/35 text-xs sm:text-sm leading-5 sm:leading-6"
          >
            No seguimos un molde. Creamos algo que encaje contigo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>