<template>
  <section
    class="relative w-full min-h-screen bg-[#090909] text-white overflow-hidden"
  >
    <div
      class="relative max-w-7xl mx-auto min-h-screen px-5 sm:px-10 lg:px-20 py-10   flex items-center"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 sm:gap-12 lg:gap-20 items-center w-full"
      >
        <!-- IMAGEN -->
        <div class="relative order-1 lg:order-1">
          <div
            class="relative w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[460px] mx-auto lg:mx-0 aspect-[4/5] overflow-hidden"
          >
            <img
              src="/img/home/barberia.jpg"
              alt="Interior de nuestra barbería"
              class="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
            />

            <div
              class="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6"
            >
              <p
                class="text-[#ffb700] text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.35em]"
              >
                The Barber Studio
              </p>

              <p
                class="mt-2 text-white text-base sm:text-lg lg:text-xl font-serif italic leading-snug"
              >
                Donde comienza tu estilo.
              </p>
            </div>
          </div>
        </div>

        <!-- CONTENIDO -->
        <div class="order-2 lg:order-2 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <p
            class="text-[#ffb700] text-[10px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] font-medium"
          >
            Sobre nosotros
          </p>

          <h2
            class="mt-4 sm:mt-5 lg:mt-6 font-barber uppercase text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[0.92] tracking-[-0.03em]"
          >
            DONDE TU ESTILO
            <br />
            <span class="text-[#ffb700]">TOMA FORMA.</span>
          </h2>

          <div
            class="mt-5 sm:mt-6 lg:mt-8 space-y-4 text-white/55 text-sm sm:text-base leading-6 sm:leading-7 font-light max-w-[480px] mx-auto lg:mx-0"
          >
            <p>
              Nuestra peluquería nació para hacer de cada visita algo más que un
              simple corte. Creamos un espacio donde el estilo, la confianza y
              la atención se encuentran.
            </p>

            <p>
              Cada servicio está pensado para cuidar los detalles y entender lo
              que buscas, porque creemos que un buen resultado comienza
              escuchando a cada cliente.
            </p>
          </div>

          <!-- STATS -->
          <div
            class="mt-8 sm:mt-10 grid grid-cols-3 border-t border-white/10 pt-6 sm:pt-7"
          >
            <div>
              <span class="block font-barber text-2xl sm:text-3xl text-white">
                +5
              </span>
              <span
                class="block mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/35"
              >
                Años
              </span>
            </div>

            <div>
              <span class="block font-barber text-2xl sm:text-3xl text-white">
                +2K
              </span>
              <span
                class="block mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/35"
              >
                Clientes
              </span>
            </div>

            <div>
              <span class="block font-barber text-2xl sm:text-3xl text-white">
                100%
              </span>
              <span
                class="block mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/35"
              >
                Dedicación
              </span>
            </div>
          </div>

          <div class="mt-8 sm:mt-9">
            <p
              class="text-xs sm:text-sm text-[#ffb700] italic leading-relaxed max-w-[420px] mx-auto lg:mx-0"
            >
              "No se trata solo de cómo te ves, sino de cómo te sientes al
              salir."
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>