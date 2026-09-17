<!-- components/Home/Scene1Hero.vue -->

<template>
  <div class="absolute inset-0 flex items-center pointer-events-none">
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">

        <div class="flex justify-center lg:justify-start">
          <div class="relative w-full max-w-[380px] aspect-[4/5] overflow-hidden">

            <img
              src="/img/home/chaleco.jpg"
              alt="Barbero trabajando"
              class="w-full h-full object-cover"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
            />

            <div class="absolute bottom-6 left-6 right-6">

              <p
                class="text-[#ffb700] text-[9px] uppercase tracking-[0.35em]"
              >
                Sin atajos
              </p>

              <p
                class="mt-2 text-white text-xl sm:text-2xl font-serif italic"
              >
                La diferencia está en cómo lo hacemos.
              </p>

            </div>

          </div>
        </div>

        <div class="max-w-xl">

          <p
            class="text-[#ffb700] text-[10px] uppercase tracking-[0.35em] font-medium"
          >
            01 / El oficio
          </p>

          <h2
            class="mt-5 font-barber uppercase text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.9] tracking-[-0.035em]"
          >
            TU ESTILO
            <br />
            COMIENZA
            <br />
            <span class="text-[#ffb700]">AQUÍ.</span>
          </h2>

          <p
            class="mt-7 text-white/60 text-sm sm:text-base leading-7 font-light max-w-[430px]"
          >
            Cada persona tiene una forma distinta de llevar su estilo.
            Nosotros nos encargamos de entenderla, trabajarla y llevarla
            a un resultado que realmente se sienta tuyo.
          </p>

          <p
            class="mt-5 text-white/35 text-xs sm:text-sm leading-6"
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