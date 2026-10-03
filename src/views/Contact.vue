<template>
  <section
    ref="sectionRef"
    class="w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-20 py-5"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Encabezado (lo único que anima el padre) -->
      <div data-anim-head class="max-w-2xl mb-14">
        <div class="flex items-center gap-3 mb-5">
          <span
            class="text-[#ffb700] text-[9px] uppercase tracking-[0.35em] font-medium"
          >
            Estamos para ayudarte
          </span>
        </div>

        <h2
          class="font-barber text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight uppercase"
        >
          ¿Necesitas
          <span class="text-[#ffb700]">ayuda?</span>
        </h2>

        <p
          class="mt-5 text-white/40 text-sm sm:text-base leading-relaxed max-w-xl"
        >
          Si tienes algún inconveniente con tu reserva, necesitas modificar una
          cita o simplemente quieres comunicarte con nosotros, puedes hacerlo
          directamente por cualquiera de nuestros canales.
        </p>
      </div>

      <!-- Cuadros (componente hijo con su propia animación) -->
      <AyudaCards />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRevealOnScroll } from "@/composables/useRevealOnScroll";
import AyudaCards from "@/components/contact/AyudaCards.vue";

const sectionRef = ref<HTMLElement | null>(null);

// Solo anima los elementos con data-anim-head (NO los del hijo)
useRevealOnScroll(sectionRef, {
  selector: "[data-anim-head]",
  y: 40,
  stagger: 0.15,
});
</script>

<style scoped></style>