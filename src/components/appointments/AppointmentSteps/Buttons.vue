<template>
  <nav aria-label="Progreso de la reserva" class="booking-progress min-w-0">
    <ol class="grid grid-cols-4 gap-1 sm:gap-3">
      <li v-for="(step, index) in steps" :key="step.route">
        <button
          type="button"
          class="w-full text-left rounded-lg py-1 px-1 sm:px-2 focus-visible:outline focus-visible:outline-[#ffb700]"
          :disabled="!canVisit(index) || booking.saving"
          :aria-current="active === index ? 'step' : undefined"
          @click="router.push({ name: step.route })"
        >
          <span class="flex items-center gap-2 mb-1 px-3"
            ><span
              class="flex size-6 shrink-0 items-center justify-center rounded-full text-xs"
              :class="
                active === index
                  ? 'bg-[#ffb700] text-black'
                  : active > index
                    ? 'bg-[#ffb700]/15 text-[#ffb700]'
                    : 'bg-white/10 text-white/55'
              "
              >{{ active > index ? "✓" : index + 1 }}</span
            ><span
              class="hidden sm:block h-px flex-1"
              :class="active >= index ? 'bg-[#ffb700]/40' : 'bg-white/10'"
          /></span>
          <span
            class="text-xs sm:text-sm"
            :class="
              active === index
                ? 'text-[#ffb700]'
                : canVisit(index)
                  ? 'text-white/80'
                  : 'text-white/45'
            "
            >{{ step.label }}</span
          >
        </button>
      </li>
    </ol>
  </nav>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
const booking = useAppointmentBookingStore();
const route = useRoute();
const router = useRouter();
const steps = computed(() => [
  ...(booking.bookingMode === "barber" ? [
    { route: "BarberSelect", label: "Barbero" },
    { route: "AppointmentSlot", label: "Horario" },
  ] : [
  { route: "AppointmentSlot", label: "Horario" },
  { route: "BarberSelect", label: "Barbero" },
  ]),
  { route: "New-appointments", label: "Servicios" },
  { route: "New-Appointments-details", label: "Confirmación" },
]);
const active = computed(() =>
  steps.value.findIndex((step) => step.route === route.name),
);
function canVisit(index: number) {
  if (index === 0) return true;
  if (index === 1) return booking.bookingMode === "barber" ? !!booking.barber : !!(booking.date && booking.time);
  const ready = !!(booking.barber && booking.date && booking.time);
  return ready && (index === 2 || !!booking.services.length);
}
</script>
