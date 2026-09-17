```vue
<template>
  <section
    class="relative w-full min-h-screen bg-[#090909] text-white overflow-hidden"
  >
    <div
      class="relative max-w-7xl mx-auto min-h-screen px-6 sm:px-10 lg:px-16 py-10 flex items-center"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center w-full"
      >
        <!-- IMAGEN -->
        <div class="relative order-2 lg:order-1">
          <div
            class="relative w-full max-w-[520px] mx-auto lg:mx-0 aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <img
              src="/img/home/barberia.jpg"
              alt="Interior de nuestra barbería"
              class="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
            />

            <div class="absolute bottom-7 left-7">
              <p class="text-[#ffb700] text-[11px] uppercase tracking-[0.35em]">
                The Barber Studio
              </p>

              <p class="mt-2 text-xl sm:text-2xl font-sans font-medium">
                Donde comienza tu estilo.
              </p>
            </div>
          </div>
        </div>

        <!-- CONTENIDO -->
        <div class="order-1 lg:order-2 max-w-xl lg:pl-4">
          <p
            class="text-[#ffb700] text-xs uppercase tracking-[0.35em] font-sans"
          >
            Sobre nosotros
          </p>

          <h2
            class="mt-5 font-barber text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1] tracking-tight uppercase"
          >
            Donde tu estilo
            <span class="text-[#ffb700] italic normal-case">toma forma.</span>
          </h2>

          <div
            class="mt-8 space-y-5 text-white/55 text-sm sm:text-base font-sans leading-7"
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

          <div
            class="mt-10 grid grid-cols-3 border-t border-white/10 pt-7 font-sans"
          >
            <div>
              <span class="block text-2xl font-semibold text-white"> +5 </span>

              <span
                class="block mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35"
              >
                Años
              </span>
            </div>

            <div>
              <span class="block text-2xl font-semibold text-white"> +2K </span>

              <span
                class="block mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35"
              >
                Clientes
              </span>
            </div>

            <div>
              <span class="block text-2xl font-semibold text-white">
                100%
              </span>

              <span
                class="block mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35"
              >
                Dedicación
              </span>
            </div>
          </div>

          <div class="mt-9">
            <p class="text-sm text-[#ffb700] italic font-sans">
              “No se trata solo de cómo te ves, sino de cómo te sientes al
              salir.”
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
```
