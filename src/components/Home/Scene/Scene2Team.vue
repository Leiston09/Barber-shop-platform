<!-- components/Home/Scene/Scene2Team.vue -->

<template>
  <div class="absolute inset-0 flex items-center pointer-events-none">
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-10">
      <div class="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-20 items-center">

        <div class="order-2 lg:order-1 max-w-lg">
          <p class="text-[#ffb700] text-[9px] uppercase tracking-[0.3em] font-medium">
            02 / La experiencia
          </p>

          <h2
            class="mt-4 font-barber uppercase text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[0.92] tracking-[-0.03em]"
          >
            VEN POR
            <br />
            EL CORTE.
            <br />
            <span class="text-[#ffb700]">QUÉDATE POR</span>
            <br />
            LA EXPERIENCIA.
          </h2>

          <p class="mt-5 text-white/60 text-xs sm:text-sm leading-6 font-light max-w-[380px]">
            Aquí no se trata de entrar, sentarte y salir.
            Queremos que disfrutes el momento, la conversación
            y la sensación de estar en un lugar hecho para ti.
          </p>

          <p class="mt-4 text-white/35 text-[11px] sm:text-xs italic">
            Tómate el tiempo. Nosotros nos encargamos del resto.
          </p>
        </div>

        <div class="order-1 lg:order-2">
          <div
            class="relative w-full h-[34vh] sm:h-[40vh] lg:h-[48vh] max-h-[480px] overflow-hidden"
          >
            <img
              src="/img/home/barberia.jpg"
              alt="Interior de la barbería"
              class="w-full h-full object-cover"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/5"
            />

            <div class="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
              <p class="text-[#ffb700] text-[8px] uppercase tracking-[0.3em]">
                El ambiente
              </p>

              <p class="mt-1.5 text-white text-lg sm:text-xl font-serif italic">
                Aquí el tiempo se disfruta.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>