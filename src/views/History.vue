<template>
  <section
    ref="sectionRef"
    class="relative w-full  bg-[#090909] text-white overflow-hidden flex items-center"
  >
    <div
      class="relative w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 py-10"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 sm:gap-8 lg:gap-14 items-center w-full"
      >
        <!-- IMAGEN -->
        <div data-anim class="relative order-1 lg:order-1">
          <div
            class="relative w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[340px] mx-auto lg:mx-0 aspect-[4/5] overflow-hidden"
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
              class="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5"
            >
              <p
                class="text-[#ffb700] text-[8px] sm:text-[9px] uppercase tracking-[0.3em]"
              >
                The Barber Studio
              </p>

              <p
                class="mt-1.5 text-white text-sm sm:text-base font-serif italic leading-snug"
              >
                Donde comienza tu estilo.
              </p>
            </div>
          </div>
        </div>

        <!-- CONTENIDO -->
        <div
          class="order-2 lg:order-2 max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
        >
          <p
            data-anim
            class="text-[#ffb700] text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-medium"
          >
            Sobre nosotros
          </p>

          <h2
            data-anim
            class="mt-2 sm:mt-3 font-barber uppercase text-white text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-[0.95] tracking-[-0.03em]"
          >
            DONDE TU ESTILO
            <br />
            <span class="text-[#ffb700]">TOMA FORMA.</span>
          </h2>

          <div
            data-anim
            class="mt-3 sm:mt-4 space-y-2.5 text-white/55 text-xs sm:text-sm leading-5 sm:leading-6 font-light max-w-[480px] mx-auto lg:mx-0"
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
            data-anim
            class="mt-4 sm:mt-5 grid grid-cols-3 border-t border-white/10 pt-4"
          >
            <div>
              <span class="block font-barber text-xl sm:text-2xl text-white">
                +5
              </span>
              <span
                class="block mt-0.5 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/35"
              >
                Años
              </span>
            </div>

            <div>
              <span class="block font-barber text-xl sm:text-2xl text-white">
                +2K
              </span>
              <span
                class="block mt-0.5 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/35"
              >
                Clientes
              </span>
            </div>

            <div>
              <span class="block font-barber text-xl sm:text-2xl text-white">
                100%
              </span>
              <span
                class="block mt-0.5 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/35"
              >
                Dedicación
              </span>
            </div>
          </div>

          <div data-anim class="mt-4 sm:mt-5">
            <p
              class="text-[11px] sm:text-xs text-[#ffb700] italic leading-relaxed max-w-[420px] mx-auto lg:mx-0"
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
import { ref } from "vue";
import { useRevealOnScroll } from "@/composables/useRevealOnScroll";

const sectionRef = ref<HTMLElement | null>(null);

useRevealOnScroll(sectionRef);
</script>

<style scoped>
img {
  user-select: none;
  -webkit-user-drag: none;
}
</style>