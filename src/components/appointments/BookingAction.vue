<template>
  <div v-if="presentation === 'sidebar'" class="sidebar-action">
    <template v-if="route.name === 'New-appointments' || route.name === 'New-Appointments-details'">
      <button type="button" :disabled="disabled" @click="advance"
        class="sidebar-primary flex min-h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-[#ffb700] bg-[#ffb700] px-[15px] py-3 text-sm font-semibold text-[#171207] transition-[background-color,border-color,box-shadow] duration-200 enabled:hover:border-[#ffc335] enabled:hover:bg-[#ffc335] enabled:hover:shadow-[0_6px_20px_#ffb7001a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd66d] disabled:cursor-not-allowed disabled:border-[#ffffff15] disabled:bg-[#26231c] disabled:text-[#aaa28e] motion-reduce:transition-none">
        <svg v-if="!booking.saving" aria-hidden="true" class="size-[17px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="isDetails"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></template>
          <template v-else><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 10h16m-11 6 2 2 4-4" /></template>
        </svg>
        <span>{{ booking.saving ? 'Reservando…' : isDetails ? 'Confirmar reserva' : 'Revisar reserva' }}</span>
      </button>
      <p class="sidebar-action-note mt-2.5 text-center text-[11px] leading-[1.6] text-pretty text-[#939087]" role="status">{{ reason || (isDetails ? 'Tu cita se guardará al confirmar.' : 'Revisa los datos antes de confirmar.') }}</p>
    </template>
    <p v-else class="sidebar-step-note flex items-start gap-2.5 text-xs leading-[1.6] text-[#a8a49a]">
      <svg aria-hidden="true" class="mt-0.5 size-4 shrink-0 text-white/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <template v-if="route.name === 'BarberSelect'"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></template>
        <template v-else><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 10h16" /></template>
      </svg>
      <span>{{ route.name === 'BarberSelect' ? 'Elige al barbero que te atenderá.' : 'Elige un turno para empezar tu reserva.' }}</span>
    </p>
  </div>
  <div v-else>
    <template v-if="route.name === 'New-appointments' || route.name === 'New-Appointments-details'">
      <button type="button" :disabled="disabled" @click="advance" class="booking-primary min-h-[46px] w-full rounded-[.65rem] bg-[#ffb700] px-4 py-3 text-sm font-semibold text-[#111] transition-[background-color,box-shadow] duration-200 enabled:hover:bg-[#ffc433] enabled:hover:shadow-[0_6px_20px_#ffb7001a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] disabled:bg-[#39352b] disabled:text-[#bcb5a3] motion-reduce:transition-none">
        {{ label }}
      </button>
      <p v-if="reason" class="mt-2 text-xs leading-relaxed text-white/65" role="status">{{ reason }}</p>
    </template>
    <p v-else class="text-sm leading-relaxed text-white/65">{{ route.name === 'BarberSelect' ? 'Elige un barbero para continuar.' : 'Selecciona un turno disponible para continuar.' }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "@/lib/notifications";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
withDefaults(defineProps<{ presentation?: "default" | "sidebar" }>(), { presentation: "default" });
const booking = useAppointmentBookingStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const isDetails = computed(() => route.name === "New-Appointments-details");
const disabled = computed(
  () =>
    booking.saving ||
    !booking.services.length ||
    (isDetails.value && !booking.validateReservation),
);
const label = computed(() =>
  booking.saving
    ? "Reservando…"
    : isDetails.value
      ? "Confirmar reserva"
      : "Revisar mi reserva",
);
const reason = computed(() => {
  if (booking.saving)
    return "Estamos guardando tu reserva. Espera la confirmación.";
  if (!booking.services.length) return "Selecciona al menos un servicio.";
  if (isDetails.value && (booking.loadingHours || booking.loadingSchedule))
    return "Comprobando la disponibilidad del turno…";
  if (isDetails.value && booking.availabilityError)
    return "Reintenta la consulta de la agenda para continuar.";
  if (isDetails.value && !booking.validateReservation)
    return "Elige una hora disponible en la agenda de tu barbero.";
  return "";
});
function advance() {
  if (disabled.value) return;
  if (isDetails.value) void booking.saveAppointment(toast);
  else void router.push({ name: "New-Appointments-details" });
}
</script>
