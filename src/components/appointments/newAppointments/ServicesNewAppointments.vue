<template>
  <div>
    <!-- ENCABEZADO -->
    <div class="text-center mb-8 sm:mb-10">


      <h1
        class="font-barber text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-[0.95]"
      >
        Elige tus
        <span class="text-[#ffb700]"> servicios.</span>
      </h1>

      <p
        class="text-white/40 text-xs sm:text-sm font-light mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed"
      >
        Selecciona al menos un servicio para tu cita. Puedes elegir hasta 2.
      </p>
    </div>

    <!-- CARGANDO -->
    <div
      v-if="serviceStore.loading"
      class="text-center py-16 sm:py-20"
    >
      <div
        class="inline-block w-8 h-8 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
      ></div>

      <p
        class="text-white/40 text-[10px] uppercase tracking-[0.3em] mt-4"
      >
        Cargando servicios
      </p>
    </div>

    <!-- SIN SERVICIOS -->
    <div
      v-else-if="serviceStore.services.length === 0"
      class="text-center py-16 sm:py-20 border border-white/5 rounded-2xl bg-white/[0.02] px-6 max-w-lg mx-auto"
    >
      <div
        class="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full border border-white/10 flex items-center justify-center mb-4"
      >
        <svg
          class="w-6 h-6 sm:w-7 sm:h-7 text-white/20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
          />
        </svg>
      </div>

      <p class="text-white/70 text-sm sm:text-base font-barber">
        No hay servicios disponibles
      </p>

      <p
        class="text-white/35 text-xs mt-2 max-w-[280px] mx-auto leading-relaxed"
      >
        Por el momento no hay servicios activos. Vuelve a intentarlo más tarde.
      </p>
    </div>

    <!-- LISTA DE SERVICIOS -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
    >
      <ServiceItem
        v-for="service in serviceStore.services"
        :key="service._id"
        :service="service"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import ServiceItem from "@/components/UI/ServiceItem.vue";
import { useServiceStore } from "@/stores/service";

const serviceStore = useServiceStore();

onMounted(() => {
  serviceStore.loadServices();
});
</script>

<style scoped></style>

