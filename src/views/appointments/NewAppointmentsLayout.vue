<template>
  <div>
    <!-- NAVEGACIÓN -->
    <nav class="flex gap-3 mb-8">
      <RouterLink
        class="flex-1 text-center py-3 text-[10px] font-barber uppercase tracking-[0.2em] border transition-all duration-300 rounded"
        :class="
          route.name === 'New-appointments'
            ? 'bg-[#ffb700] text-black border-[#ffb700]'
            : 'bg-transparent text-white/50 border-white/10 hover:text-white hover:border-[#ffb700]/50'
        "
        :to="{ name: 'New-appointments' }"
      >
        Servicios
      </RouterLink>

      <RouterLink
        class="flex-1 text-center py-3 text-[10px] font-barber uppercase tracking-[0.2em] border transition-all duration-300 rounded"
        :class="
          route.name === 'New-Appointments-details'
            ? 'bg-[#ffb700] text-black border-[#ffb700]'
            : 'bg-transparent text-white/50 border-white/10 hover:text-white hover:border-[#ffb700]/50'
        "
        :to="{ name: 'New-Appointments-details' }"
      >
        Citas y Resumen
      </RouterLink>
    </nav>

    <!-- CONTENIDO -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";

const route = useRoute();
const appointmentBooking =
  useAppointmentBookingStore();

onMounted(() => {
  appointmentBooking.clearAppointmentData();
});
</script>

<style scoped></style>