<template>
  <section aria-labelledby="slot-title" class="space-y-5">
    <header>
      <p class="mb-2 text-xs text-[#c4a760]">Paso {{ preferred ? 2 : 1 }} de 4 · Elige tu horario</p>
      <h2 id="slot-title" class="font-barber text-2xl leading-tight text-balance sm:text-3xl">
        <template v-if="preferred">Elige una hora con <span class="text-[#ffb700]">{{ booking.barber?.name }}</span></template>
        <template v-else>Horarios de <span class="text-[#ffb700]">todos los barberos</span></template>
      </h2>
      <p class="mt-3 text-sm leading-6 text-white/55">{{ preferred ? "Solo verás los turnos libres de tu barbero." : "Elige una hora y después al barbero que te atenderá." }}</p>
    </header>

    <div class="booking-panel rounded-2xl border border-[#ffffff12] bg-[#101010] p-5 max-[360px]:p-3.5">
      <BookingAvailabilityPicker
        :date="booking.globalDate || booking.today()"
        :disabled-dates="isCalendarDateUnavailable"
        :hours="slotHours"
        :selected-time="booking.date === booking.globalDate ? booking.time : ''"
        :is-hour-unavailable="isHourUnavailable"
        :hour-status="hourStatus"
        :hours-title="preferred ? 'Turnos de ' + booking.barber?.name : 'Turnos disponibles'"
        :hours-caption="displayDate(booking.globalDate || booking.today())"
        :calendar-loading="calendarLoading"
        :calendar-error="calendarError"
        :hours-loading="booking.globalLoading"
        :hours-error="booking.globalError"
        :hour-class="hourClass"
        :disabled="booking.saving"
        @change-date="changeDate"
        @select-hour="choose"
        @retry-calendar="loadCalendarAvailability"
        @retry-hours="booking.loadGlobalAvailability()"
      >
        <template #calendar-footer><p class="mt-3 text-xs leading-5 text-white/45">Reservas hasta un mes por adelantado · Hora de Ecuador</p></template>
        <template #empty>
          <p class="font-medium text-white">{{ preferred ? 'No quedan turnos con ' + booking.barber?.name + ' este día' : 'No quedan turnos disponibles este día' }}</p>
          <p class="mt-2 text-sm text-white/65">Elige otra fecha en el calendario.</p>
          <button v-if="hasNextDay" type="button" class="mt-3 min-h-10 text-sm text-[#ffbf28] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#ffb700]" @click="nextDay">Consultar el día siguiente</button>
        </template>
        <template v-if="!preferred" #hours-hint><p class="mb-3 text-xs leading-5 text-white/45">El icono de personas muestra quién está libre en cada turno.</p></template>
        <template v-if="!preferred" #hour-extra="{ hour }">
          <button type="button" class="absolute right-0.5 top-0.5 flex size-8 items-center justify-center rounded-lg text-[#b5aa8b] hover:bg-[#ffb700]/10 hover:text-[#ffb700] aria-expanded:bg-[#ffb700]/10 aria-expanded:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-30"
            :disabled="isHourUnavailable(hour) || booking.saving"
            :aria-label="'Ver barberos disponibles a las ' + hour"
            :aria-expanded="openBarbers === hour"
            :aria-controls="'slot-barbers-' + hour.replace(':', '')"
            @click.stop="toggleBarbers(hour)">
            <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2" /></svg>
          </button>
          <div v-if="openBarbers === hour" :id="'slot-barbers-' + hour.replace(':', '')" class="absolute inset-x-0 top-full z-30 mt-1 rounded-xl border border-[#ffb700]/30 bg-[#1a1a1a] p-3 shadow-xl" role="region" :aria-label="'Barberos disponibles a las ' + hour">
            <p class="mb-2 text-xs font-medium text-[#ffb700]">{{ hour }}</p>
            <ul class="space-y-2 text-xs leading-5 text-white/85"><li v-for="person in barbersAt(hour)" :key="person._id" class="break-words">{{ person.name }}</li></ul>
          </div>
        </template>
      </BookingAvailabilityPicker>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import { useRouter } from "vue-router";
import BookingAvailabilityPicker from "../BookingAvailabilityPicker.vue";
import AppointmentsAPI from "@/api/AppointmentsAPI";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import { displayDate } from "@/helpers/date";

const booking = useAppointmentBookingStore();
const router = useRouter();

const preferred = computed(() => booking.bookingMode === "barber");
const slotHours = computed(() => booking.globalSlots.map(slot => slot.time));
function barbersAt(hour: string) { return booking.globalSlots.find(slot => slot.time === hour)?.barbers ?? []; }
function isHourUnavailable(hour: string) { return !barbersAt(hour).length; }
function hourStatus(hour: string) { return isHourUnavailable(hour) ? "Sin barberos libres" : isSelected(hour) ? "Seleccionado" : "Disponible"; }
function hourClass(hour: string) { return openBarbers.value === hour ? "slot-card z-30" : "slot-card z-0"; }

const openBarbers = ref<string | null>(null);
const calendarDays = ref<Record<string, boolean>>({});
const calendarLoading = ref(true);
const calendarError = ref("");

let calendarRequest = 0;

// FORMATEAR FECHA LOCAL
const localDateKey = (date: Date) =>
  date.getFullYear() +
  "-" +
  String(date.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(date.getDate()).padStart(2, "0");

// COMPROBAR DISPONIBILIDAD DEL DÍA
function isCalendarDateUnavailable(date: Date) {
  return calendarDays.value[localDateKey(date)] !== true;
}

// ACTUALIZAR DISPONIBILIDAD
function updateSelectedDayAvailability() {
  if (booking.globalDate && !booking.globalLoading && !booking.globalError) {
    calendarDays.value[booking.globalDate] = booking.globalSlots.some(
      (slot) => slot.barbers.length > 0,
    );
  }
}

// CONSULTAR CALENDARIO
async function loadCalendarAvailability() {
  const request = ++calendarRequest;

  calendarLoading.value = true;
  calendarError.value = "";

  const start = booking.today();
  const end = new Date(start + "T12:00:00");

  end.setMonth(end.getMonth() + 1);

  try {
    const { data } = await AppointmentsAPI.calendarAvailability(
      start,
      localDateKey(end),
      booking.bookingMode === "barber" ? booking.barber?._id : undefined,
    );

    if (request !== calendarRequest) return;

    if (
      !data.days ||
      typeof data.days !== "object" ||
      Array.isArray(data.days)
    ) {
      throw new Error("Invalid calendar availability");
    }

    calendarDays.value = data.days;

    updateSelectedDayAvailability();
  } catch {
    if (request === calendarRequest) {
      calendarError.value =
        "No pudimos comprobar los días disponibles. Reintenta para ver el calendario.";
    }
  } finally {
    if (request === calendarRequest) {
      calendarLoading.value = false;
    }
  }
}

// SINCRONIZAR DISPONIBILIDAD
watch(
  [
    () => booking.globalDate,
    () => booking.globalSlots,
    () => booking.globalLoading,
    () => booking.globalError,
  ],
  updateSelectedDayAvailability,
);

// COMPROBAR HORARIO SELECCIONADO
function isSelected(time: string): boolean {
  return booking.date === booking.globalDate && booking.time === time;
}

// CAMBIAR FECHA
function changeDate(date: string) {
  openBarbers.value = null;
  void booking.loadGlobalAvailability(date);
}

// SELECCIONAR HORARIO
function choose(time: string) {
  if (booking.selectSlot(time)) {
    void router.push({ name: booking.bookingMode === "barber" ? "New-appointments" : "BarberSelect" });
  }
}

// MOSTRAR / OCULTAR BARBEROS
function toggleBarbers(time: string) {
  openBarbers.value = openBarbers.value === time ? null : time;
}

// COMPROBAR SI EXISTE UN DÍA SIGUIENTE
const hasNextDay = computed(() => {
  const max = new Date(booking.today() + "T12:00:00");

  max.setMonth(max.getMonth() + 1);

  const maxDate = localDateKey(max);

  return (booking.globalDate || booking.today()) < maxDate;
});

// CONSULTAR DÍA SIGUIENTE
function nextDay() {
  const date = new Date((booking.globalDate || booking.today()) + "T12:00:00");

  date.setDate(date.getDate() + 1);

  const max = new Date(booking.today() + "T12:00:00");

  max.setMonth(max.getMonth() + 1);

  if (date <= max) {
    changeDate(localDateKey(date));
  }
}

// CERRAR LISTA AL PULSAR FUERA
function closePreview(event: PointerEvent) {
  if (
    !(event.target instanceof Element) ||
    !event.target.closest(".slot-card")
  ) {
    openBarbers.value = null;
  }
}

// CERRAR LISTA CON ESCAPE
function onEscape(event: KeyboardEvent) {
  if (event.key === "Escape") {
    openBarbers.value = null;
  }
}

// CARGAR DISPONIBILIDAD
onMounted(() => {
  void loadCalendarAvailability();

  void booking.loadGlobalAvailability(booking.globalDate || booking.today());

  document.addEventListener("pointerdown", closePreview);

  document.addEventListener("keydown", onEscape);
});

// LIMPIAR EVENTOS
onUnmounted(() => {
  calendarRequest++;

  document.removeEventListener("pointerdown", closePreview);

  document.removeEventListener("keydown", onEscape);
});
</script>
