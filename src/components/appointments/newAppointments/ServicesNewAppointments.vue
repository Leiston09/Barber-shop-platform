<template>
  <div>
    <!-- ENCABEZADO -->
    <div class="mb-10">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-8 h-px bg-[#ffb700]" />
        <span
          class="text-[#ffb700] text-[9px] uppercase tracking-[0.35em] font-medium"
        >
          Paso 02
        </span>
      </div>

      <h1
        class="font-barber text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight"
      >
        Elige tus <span class="text-[#ffb700] font-medium">servicios</span>
      </h1>

      <p class="text-white/40 text-sm font-light mt-3 max-w-md">
        Selecciona al menos un servicio para tu cita. Puedes elegir hasta 2.
      </p>
    </div>

    <!-- CARGANDO -->
    <div v-if="serviceStore.loading" class="text-center py-16">
      <div
        class="inline-block w-8 h-8 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
      ></div>
      <p class="text-white/40 text-xs uppercase tracking-[0.3em] mt-4">
        Cargando servicios
      </p>
    </div>

    <!-- SIN SERVICIOS -->
    <div
      v-else-if="serviceStore.services.length === 0"
      class="text-center py-16 border border-white/5 rounded-2xl bg-white/[0.02]"
    >
      <p class="text-white/40 text-sm font-light">
        No hay servicios disponibles
      </p>
    </div>

    <!-- LISTA DE SERVICIOS -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ServiceItem
        v-for="service in serviceStore.services"
        :key="service._id"
        :service="service"
      />
    </div>

    <!-- NAVEGACIÓN -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 mt-10 border-t border-white/5"
    >
      <RouterLink
        :to="{ name: 'BarberSelect' }"
        class="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#ffb700] transition"
      >
        ← Volver a barberos
      </RouterLink>

      <RouterLink
        v-if="appointmentBooking.services.length > 0"
        :to="{ name: 'New-Appointments-details' }"
        class="px-8 py-4 bg-[#ffb700] text-black text-sm font-barber font-medium uppercase tracking-[0.15em] rounded-lg hover:bg-[#e6a500] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffb700]/20"
      >
        Continuar con fecha y hora →
      </RouterLink>

      <span
        v-else
        class="px-8 py-4 bg-white/5 text-white/25 text-sm font-barber font-medium uppercase tracking-[0.15em] rounded-lg cursor-not-allowed"
      >
        Elige al menos 1 servicio
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import ServiceItem from "@/components/UI/ServiceItem.vue";
import { useServiceStore } from "@/stores/service";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";

const serviceStore = useServiceStore();
const appointmentBooking = useAppointmentBookingStore();

onMounted(() => {
  serviceStore.loadServices();
});
</script>

<style scoped></style>