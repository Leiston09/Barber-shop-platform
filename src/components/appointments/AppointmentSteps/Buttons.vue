<template>
  <nav
    class="flex items-center gap-1 p-1 sm:gap-1.5 sm:p-1.5 mb-6 sm:mb-10 bg-white/[0.025] border border-white/5 rounded-xl overflow-x-auto scrollbar-hide"
  >
    <!-- BARBERO -->
    <RouterLink
      :to="{ name: 'BarberSelect' }"
      class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg transition-all duration-500 ease-out whitespace-nowrap shrink-0"
      :class="
        route.name === 'BarberSelect'
          ? 'flex-[1.8] bg-[#ffb700] text-black shadow-[0_0_25px_rgba(255,183,0,0.08)]'
          : 'flex-1 text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
      "
    >
      <span
        class="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500"
        :class="route.name === 'BarberSelect' ? 'bg-black scale-110' : 'bg-white/20'"
      />
      <span>Barbero</span>
    </RouterLink>

    <!-- SERVICIOS -->
    <RouterLink
      v-if="canAccessServices"
      :to="{ name: 'New-appointments' }"
      class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg transition-all duration-500 ease-out whitespace-nowrap shrink-0"
      :class="
        route.name === 'New-appointments'
          ? 'flex-[1.8] bg-[#ffb700] text-black shadow-[0_0_25px_rgba(255,183,0,0.08)]'
          : 'flex-1 text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
      "
    >
      <span
        class="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500"
        :class="route.name === 'New-appointments' ? 'bg-black scale-110' : 'bg-white/20'"
      />
      <span>Servicios</span>
    </RouterLink>

    <button
      v-else
      type="button"
      disabled
      class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg text-white/15 cursor-not-allowed whitespace-nowrap shrink-0"
    >
      <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-white/10" />
      <span>Servicios</span>
    </button>

    <!-- DETALLES -->
    <RouterLink
      v-if="canAccessDetails"
      :to="{ name: 'New-Appointments-details' }"
      class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg transition-all duration-500 ease-out whitespace-nowrap shrink-0"
      :class="
        route.name === 'New-Appointments-details'
          ? 'flex-[1.8] bg-[#ffb700] text-black shadow-[0_0_25px_rgba(255,183,0,0.08)]'
          : 'flex-1 text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
      "
    >
      <span
        class="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500"
        :class="route.name === 'New-Appointments-details' ? 'bg-black scale-110' : 'bg-white/20'"
      />
      <span>Detalles</span>
    </RouterLink>

    <button
      v-else
      type="button"
      disabled
      class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg text-white/15 cursor-not-allowed whitespace-nowrap shrink-0"
    >
      <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-white/10" />
      <span>Detalles</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";

const route = useRoute();
const appointmentBooking = useAppointmentBookingStore();

const hasBarber = computed(() => !!appointmentBooking.barber);
const hasServices = computed(() => appointmentBooking.services.length > 0);

const canAccessServices = computed(() => hasBarber.value);
const canAccessDetails = computed(
  () => hasBarber.value && hasServices.value,
);
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>