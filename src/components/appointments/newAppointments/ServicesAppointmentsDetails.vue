<template>
  <section aria-labelledby="details-title" class="space-y-6">
    <div>
      <p class="booking-eyebrow mb-3 text-xs text-[#c4a760] tracking-[.05em]">Paso 4 de 4 · Última revisión</p>
      <h2 id="details-title" class="booking-title font-barber text-[clamp(1.8rem,3.5vw,3rem)] font-normal leading-[1.15] text-balance">
        Revisa y confirma <span class="text-[#ffb700]">tu reserva.</span>
      </h2>
      <p class="booking-description mt-4 max-w-[42rem] text-[.9375rem] leading-[1.7] text-[#aaa]">
        Comprueba tu elección antes de confirmar. Si cambias de fecha u hora
        aquí, verás únicamente la agenda de {{ booking.barber?.name }}.
      </p>
    </div>
    <div
      v-if="booking.saveError"
      class="booking-message border-amber-400/30 rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]"
      role="alert"
    >
      {{ booking.saveError }}
    </div>
    <div class="booking-panel space-y-5 rounded-2xl border border-[#ffffff12] bg-[#101010] p-5 max-[360px]:p-3.5">
      <div
        class="grid items-center gap-5 text-center sm:grid-cols-[136px_minmax(0,1fr)] sm:text-left"
      >
        <BarberPortrait
          :id="booking.barber?._id"
          :name="booking.barber?.name || 'Tu barbero'"
          class="details-barber-portrait w-[136px] h-[156px]! sm:h-[156px]! justify-self-center border border-[#ffffff18]! rounded-[.875rem]"
        />
        <div class="min-w-0">
          <p class="text-xs text-white/50">Tu barbero</p>
          <p class="mt-1 font-barber text-2xl text-white break-words">
            {{ booking.barber?.name }}
          </p>
          <p class="mt-2 text-sm text-white/60">
            Te atenderá durante el turno seleccionado.
          </p>
          <RouterLink
            :to="{ name: 'BarberSelect' }"
            class="booking-link mt-4 inline-block text-sm text-[#ffbf28] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#ffb700] focus-visible:outline-offset-4"
            >Cambiar barbero</RouterLink
          >
        </div>
      </div>
      <div class="border-t border-white/10 pt-4">
        <div class="flex justify-between items-center gap-3 mb-3">
          <h3 class="text-sm text-white/70">Servicios elegidos</h3>
          <RouterLink :to="{ name: 'New-appointments' }" class="booking-link text-sm text-[#ffbf28] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#ffb700] focus-visible:outline-offset-4"
            >Editar servicios</RouterLink
          >
        </div>
        <ul class="space-y-3">
          <li
            v-for="service in booking.services"
            :key="service._id"
            class="flex items-center justify-between gap-3 text-sm"
          >
            <span class="text-white/90">{{ service.name }}</span
            ><span class="text-white/70">{{
              formatCurrency(service.price)
            }}</span>
          </li>
        </ul>
        <p v-if="!booking.services.length" class="text-sm text-amber-300">
          Selecciona al menos un servicio para confirmar.
        </p>
      </div>
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"
      >
        <p class="text-white/80">
          {{ displayDate(booking.date) }} ·
          <strong class="text-[#ffb700]">{{
            booking.time || "Elige una hora"
          }}</strong
          ><span class="block text-sm text-white/55 mt-1"
            >Un turno de 60 minutos · Hora de Ecuador</span
          >
        </p>
        <p class="text-xl text-[#ffb700]">
          {{ formatCurrency(booking.totalService) }}
          <span class="text-sm text-white/55">total</span>
        </p>
      </div>
    </div>
    <details
      class="booking-panel rounded-2xl border border-[#ffffff12] bg-[#101010] p-5 max-[360px]:p-3.5"
      :open="!booking.time || !!booking.availabilityError"
    >
      <summary
        class="group flex cursor-pointer list-none items-center gap-3 text-white font-medium transition-colors duration-300 hover:text-[#ffb700] focus-visible:outline focus-visible:outline-[#ffb700] [&::-webkit-details-marker]:hidden"
      >
        <!-- ÍCONO DE EXCLAMACIÓN -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="shrink-0 text-[#ffb700] transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>

        <span class="flex-1">
          ¿Deseas cambiar fecha u hora con {{ booking.barber?.name }}?
        </span>

        <!-- FLECHA DESPLEGABLE -->
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="shrink-0 text-white/50 transition-transform duration-300 group-open:rotate-180"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>

      <p class="text-sm text-white/60 mt-3 mb-5">
        Conservarás este barbero y tus servicios. Al cambiar el día deberás
        elegir una nueva hora.
      </p>
      <BookingAvailabilityPicker
        :date="booking.date"
        :disabled-dates="isCalendarDateUnavailable"
        :hours="booking.noSchedule ? [] : booking.hours"
        :selected-time="booking.time"
        :is-hour-unavailable="booking.isHourUnavailable"
        :hour-status="hourStatus"
        :hours-title="'Turnos de ' + booking.barber?.name"
        :calendar-loading="calendarLoading"
        :calendar-error="calendarError"
        calendar-loading-text="Consultando los días disponibles de tu barbero…"
        :hours-loading="booking.loadingHours || booking.loadingSchedule"
        :hours-error="booking.availabilityError"
        :disabled="booking.saving"
        empty-text="No hay turnos libres para este barbero en esta fecha. Elige otro día en el calendario o cambia de barbero."
        @change-date="changeDate"
        @select-hour="selectHour"
        @retry-calendar="loadCalendarAvailability"
        @retry-hours="retry"
      />
    </details>
    <p class="text-sm leading-relaxed text-white/60">
      Al confirmar, verificaremos de nuevo la disponibilidad. Tu reserva
      aparecerá en «Mis citas» cuando se haya guardado correctamente.
    </p>
  </section>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import AppointmentsAPI from "@/api/AppointmentsAPI";
import { RouterLink } from "vue-router";
import BookingAvailabilityPicker from "../BookingAvailabilityPicker.vue";
import BarberPortrait from "@/components/UI/BarberPortrait.vue";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import { formatCurrency } from "@/helpers";
import { displayDate } from "@/helpers/date";
const booking = useAppointmentBookingStore();
const calendarDays = ref<Record<string, boolean>>({});
const calendarLoading = ref(true);
const calendarError = ref("");
let calendarRequest = 0;
const localDateKey = (value: Date) =>
  value.getFullYear() +
  "-" +
  String(value.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(value.getDate()).padStart(2, "0");
function isCalendarDateUnavailable(value: Date) {
  return (
    booking.isDateDisabled(value) ||
    calendarDays.value[localDateKey(value)] !== true
  );
}
function updateSelectedDayAvailability() {
  if (
    booking.barber &&
    booking.date &&
    !booking.loadingHours &&
    !booking.loadingSchedule &&
    !booking.availabilityError
  ) {
    calendarDays.value[booking.date] = booking.availableHours.length > 0;
  }
}
async function loadCalendarAvailability() {
  const request = ++calendarRequest;
  const barberId = booking.barber?._id;
  calendarDays.value = {};
  calendarError.value = "";
  if (!barberId) {
    calendarLoading.value = false;
    return;
  }
  calendarLoading.value = true;
  const start = booking.today();
  const end = new Date(start + "T12:00:00");
  end.setMonth(end.getMonth() + 1);
  try {
    const { data } = await AppointmentsAPI.calendarAvailability(
      start,
      localDateKey(end),
      barberId,
    );
    if (request !== calendarRequest || booking.barber?._id !== barberId) return;
    if (!data.days || typeof data.days !== "object" || Array.isArray(data.days))
      throw new Error("Invalid calendar availability");
    calendarDays.value = data.days;
    updateSelectedDayAvailability();
  } catch {
    if (request === calendarRequest)
      calendarError.value =
        "No pudimos comprobar los días libres de este barbero. Reintenta para ver su calendario.";
  } finally {
    if (request === calendarRequest) calendarLoading.value = false;
  }
}
watch(
  [
    () => booking.date,
    () => booking.availableHours,
    () => booking.loadingHours,
    () => booking.loadingSchedule,
    () => booking.availabilityError,
  ],
  updateSelectedDayAvailability,
  { flush: "post" },
);
watch(
  () => booking.barber?._id,
  () => {
    void loadCalendarAvailability();
  },
);
onUnmounted(() => {
  calendarRequest++;
});
function hourStatus(hour: string): string {
  if (!booking.isHourUnavailable(hour))
    return booking.time === hour ? "Seleccionado" : "Disponible";
  const minutes = (value: string) =>
    Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
  const start = minutes(hour);
  if (
    booking.occupiedHours.some(
      (value) => start < minutes(value) + 60 && start + 60 > minutes(value),
    )
  )
    return "Ya reservado";
  if (booking.isHourBlocked(hour)) return "Bloqueado en la agenda";
  const now = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Guayaquil",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
  if (
    booking.date < booking.today() ||
    (booking.date === booking.today() && hour <= now)
  )
    return "Hora ya pasada";
  return "Sin turnos libres";
}
function selectHour(hour: string) {
  booking.time = hour;
  booking.saveError = "";
}
function changeDate(value: string) {
  if (value !== booking.date) {
    booking.time = "";
    booking.date = value;
    booking.saveError = "";
  }
}
async function retry() {
  await Promise.all([
    booking.loadBarberSchedule(),
    booking.loadHoursByDate(booking.date),
    loadCalendarAvailability(),
  ]);
}
onMounted(retry);
</script>
