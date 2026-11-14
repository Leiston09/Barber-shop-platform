<template>
  <dialog
    ref="dialog"
    class="m-auto w-[calc(100%-1rem)] max-w-5xl max-h-[calc(100dvh-1rem)] overflow-hidden sm:w-[calc(100%-3rem)] sm:max-h-[calc(100dvh-3rem)] rounded-2xl border border-white/15 bg-neutral-950 p-0 text-neutral-200 backdrop:bg-black/80 backdrop:backdrop-blur-sm open:flex open:flex-col"
    :aria-labelledby="'edit-title-' + appointment._id"
    :aria-busy="saving"
    :closedby="saving ? 'none' : 'closerequest'"
    @keydown.esc.prevent.stop="handleClose"
    @cancel.prevent="handleClose"
    @click="onBackdrop"
  >
    <header
      class="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5"
    >
      <div>
        <p class="mb-1 text-xs text-[#ffb700]">{{ isAdmin ? appointment.user?.name || "Gestión de reservas" : "Reprogramar tu visita" }}</p>
        <h2
          :id="'edit-title-' + appointment._id"
          class="font-barber text-2xl text-white"
        >
          {{ isAdmin ? "Modificar cita" : "Modificar tu cita" }}
        </h2>
      </div>

      <button
        type="button"
        autofocus
        :disabled="saving"
        @click="handleClose"
        aria-label="Cerrar edición de cita"
        class="flex size-11 shrink-0 items-center justify-center rounded-xl text-white/65 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]"
      >
        ✕
      </button>
    </header>

    <div
      class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-6 sm:py-5"
      :inert="saving"
    >
      <section aria-label="Cita actual y barbero seleccionado" class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
        <div class="flex min-w-0 items-center gap-3"><BarberPortrait :id="selectedBarber" :name="selectedProfessional?.name || 'Tu barbero'" compact class="edit-barber-photo h-16! w-16 shrink-0 rounded-lg border border-white/10 sm:h-16!" /><div class="min-w-0"><p class="text-xs text-white/45">Barbero de tu cita</p><p class="mt-1 break-words text-sm font-medium">{{ selectedProfessional?.name || "Sin barbero asignado" }}</p><p class="mt-1 text-xs text-white/40">{{ isAdmin ? "Profesional seleccionado" : "Se conserva al reprogramar" }}</p></div></div>
        <div class="text-sm"><p class="text-xs text-white/45">Cita actual</p><p class="mt-1 text-sm text-white/75">{{ displayDate(appointment.date) }}</p><p class="mt-1 font-medium tabular-nums text-[#ffb700]">{{ appointment.time }}</p></div>
      </section>

      <div v-if="isAdmin" class="mt-4">
        <label for="appointment-professional" class="mb-2 block text-xs text-white/55">Cambiar profesional</label>
        <select id="appointment-professional" :value="selectedBarber" :disabled="loading || saving || !!optionsError" @change="chooseBarber" class="min-h-11 w-full rounded-lg border border-white/20 bg-neutral-950 px-3 text-sm focus:border-[#ffb700] focus:outline-none">
          <option value="" disabled>Selecciona un profesional</option>
          <option v-if="selectedBarber && !barberStore.barbers.some(item => item._id === selectedBarber)" :value="selectedBarber" disabled>Profesional anterior no disponible</option>
          <option v-for="person in barberStore.barbers" :key="person._id" :value="person._id">{{ person.name }}</option>
        </select>
      </div>
      <div v-if="optionsError" role="alert" class="mt-4 rounded-xl border border-red-400/30 p-4 text-sm text-red-300"><p>{{ optionsError }}</p><button type="button" @click="loadEditorOptions" class="mt-2 min-h-10 text-[#ffb700]">Volver a consultar</button></div>
      <!-- CARGANDO -->
      <div
        v-if="loading"
        class="mt-5 rounded-xl border border-white/10 p-4 text-sm text-white/70"
        role="status"
      >
        Consultando las fechas y horas del barbero de tu cita…
      </div>

      <template v-else>
        <!-- FECHA Y HORA -->
        <div
          class="mt-5 grid gap-4 lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]"
        >
          <!-- CALENDARIO -->
          <section
            class="min-w-0 rounded-xl border border-white/10 bg-white/[0.01] p-3 sm:p-4"
            aria-label="Nueva fecha"
          >
            <h3 class="mb-3 text-sm font-medium text-white">
              Fecha con {{ selectedProfessional?.name || "tu barbero" }}
            </h3>

            <div
              v-if="loadingHours"
              class="rounded-lg border border-white/10 p-4 text-[13px] text-white/70"
              role="status"
            >
              Consultando sus días libres…
            </div>

            <div
              v-else-if="calendarError"
              class="rounded-lg border border-red-400/30 bg-red-500/5 p-4 text-[13px] text-red-300"
              role="alert"
            >
              <p>{{ calendarError }}</p>

              <button
                type="button"
                class="mt-3 text-xs text-[#ffbf28] underline underline-offset-4"
                @click="refreshAvailability()"
              >
                Reintentar
              </button>
            </div>

            <BookingCalendar
              v-else
              :model-value="selectedDate"
              :disabled-dates="disabledDates"
              @update:model-value="changeDate"
            />
          </section>

          <!-- HORARIOS -->
          <section
            class="min-w-0 rounded-xl border border-white/10 bg-white/[0.01] p-3 sm:p-4"
            aria-label="Nueva hora"
          >
            <div class="mb-3 flex items-center justify-between gap-2">
              <h3 class="text-sm font-medium text-white">Elige una hora</h3>

              <span
                v-if="!loadingHours && !hoursError && !scheduleError"
                class="text-xs text-white/55"
              >
                {{ availableHours.length }} libres
              </span>
            </div>

            <div
              v-if="loadingHours"
              class="rounded-lg border border-white/10 p-4 text-[13px] text-white/70"
              role="status"
            >
              Consultando la agenda…
            </div>

            <div
              v-else-if="scheduleError || hoursError"
              class="rounded-lg border border-red-400/30 bg-red-500/5 p-4 text-[13px] text-red-300"
              role="alert"
            >
              <p>{{ scheduleError || hoursError }}</p>

              <button
                type="button"
                class="mt-3 text-xs text-[#ffbf28] underline underline-offset-4"
                @click="refreshAvailability()"
              >
                Volver a consultar
              </button>
            </div>

            <div
              v-else-if="!schedule"
              class="rounded-lg border border-white/10 p-4 text-[13px] text-white/70"
            >
              Este barbero no tiene un horario configurado. Vuelve a consultar
              más tarde.
            </div>

            <div
              v-else-if="!hours.length || isDateFullyBlocked"
              class="rounded-lg border border-white/10 p-4 text-[13px] text-white/70"
            >
              Este barbero no atiende en esta fecha. Elige un día habilitado en
              su calendario.
            </div>

            <template v-else>
              <p
                v-if="!availableHours.length"
                class="mb-3 rounded-lg border border-red-400/30 bg-red-500/5 p-4 text-[13px] text-red-300"
              >
                No quedan turnos libres para este barbero en esta fecha. Elige
                otro día.
              </p>

              <div
                class="grid grid-cols-2 gap-2 sm:grid-cols-3"
                aria-label="Horas del barbero"
              >
                <button
                  v-for="hour in hours"
                  :key="hour"
                  type="button"
                  class="flex min-h-[66px] flex-col items-center justify-center rounded-[10px] border border-white/15 bg-transparent px-2 py-2.5 text-center transition-colors duration-200 enabled:hover:border-[#ffb700]/60 enabled:hover:bg-[#ffb700]/5 aria-pressed:border-[#ffb700] aria-pressed:bg-[#ffb700]/5 disabled:cursor-not-allowed disabled:border-red-400/40 disabled:bg-white/[0.03] disabled:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]"
                  :disabled="isHourUnavailable(hour)"
                  :aria-pressed="
                    selectedTime === hour && !isHourUnavailable(hour)
                  "
                  :aria-label="hour + ': ' + hourStatus(hour)"
                  @click="
                    selectedTime = hour;
                    saveError = '';
                  "
                >
                  <!-- NÚMERO DE HORA SIEMPRE BLANCO -->
                  <span class="font-semibold tabular-nums text-white">
                    {{ hour }}
                  </span>

                  <!-- ESTADO CON COLOR -->
                  <span
                    class="mt-1 block text-[11px] leading-snug"
                    :class="
                      isHourUnavailable(hour)
                        ? 'text-red-400'
                        : selectedTime === hour
                          ? 'text-[#ffb700]'
                          : 'text-green-400'
                    "
                  >
                    {{ hourStatus(hour) }}
                  </span>
                </button>
              </div>
            </template>
          </section>
        </div>

        <!-- SERVICIOS -->
        <section
          class="mt-5 min-w-0 rounded-xl border border-white/10 bg-white/[0.01] p-3 sm:p-4"
          aria-label="Servicios de la cita"
        >
          <h3 class="mb-3 text-sm font-medium text-white">
            {{ isAdmin ? "Servicios de la cita" : "Servicios de tu cita" }}
          </h3>

          <p
            v-if="selectedServices.length > 1"
            class="mb-3 text-xs text-white/60"
          >
            Puedes quitar un servicio. Debes conservar al menos uno.
          </p>

          <div v-if="isAdmin" class="mb-4">
            <div class="mb-3 flex flex-wrap justify-between gap-2 text-xs text-white/50"><span>Añade o cambia los servicios de la reserva.</span><span>{{ selectedServices.length }} seleccionados · Máximo {{ settings.maxServicesPerAppointment }}</span></div>
            <p v-if="selectedServices.length > settings.maxServicesPerAppointment" class="mb-3 text-xs leading-5 text-amber-200">Esta reserva conserva su selección anterior. Para añadir otros servicios debes respetar el límite actual.</p>
            <label class="block"><span class="sr-only">Buscar servicios</span><input v-model="serviceSearch" type="search" placeholder="Buscar servicio" class="mb-3 min-h-11 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm focus:border-[#ffb700] focus:outline-none" /></label>
            <div class="grid gap-2 sm:grid-cols-2">
              <button v-for="service in serviceOptions" :key="service._id" type="button" :aria-pressed="selectedServices.some(item => item._id === service._id)" :disabled="!selectedServices.some(item => item._id === service._id) && (selectedServices.length >= settings.maxServicesPerAppointment || !!optionsError)" @click="toggleService(service)" class="flex min-w-0 items-center gap-3 overflow-hidden rounded-lg border text-left aria-pressed:border-[#ffb700] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#ffb700]" :class="selectedServices.some(item => item._id === service._id) ? 'border-[#ffb700]/50 bg-[#ffb700]/5' : 'border-white/15'">
                <ServicePhoto :id="service._id" :name="service.name" :revision="service.photoUpdatedAt" class="size-16 shrink-0 self-stretch" />
                <span class="min-w-0 py-2 pr-2"><span class="block break-words text-sm text-white/85">{{ service.name }}</span><span class="mt-1 block text-xs text-[#ffb700]">{{ formatCurrency(service.price) }}</span><span class="mt-1 block text-[11px] text-white/45">{{ selectedServices.some(item => item._id === service._id) ? 'Seleccionado' : 'Añadir servicio' }}</span></span>
              </button>
            </div>
            <p v-if="!serviceOptions.length" class="py-3 text-xs text-white/50">No encontramos servicios con esa búsqueda.</p>
          </div>
          <ul class="space-y-3">
            <li
              v-for="service in selectedServices"
              :key="service._id"
              class="flex items-center gap-3 text-sm"
            >
              <span class="min-w-0 flex-1 break-words text-white/85">
                {{ service.name }}
              </span>

              <span class="shrink-0 text-white/65">
                {{ formatCurrency(service.price) }}
              </span>

              <button
                v-if="selectedServices.length > 1 || isAdmin"
                type="button"
                class="min-h-9 rounded-lg border border-red-400/30 px-2.5 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-400/10 focus-visible:outline-2 focus-visible:outline-[#ffb700]"
                :aria-label="'Quitar ' + service.name"
                @click="removeService(service._id)"
              >
                Quitar
              </button>
            </li>
          </ul>

          <div
            class="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3"
          >
            <span class="text-sm text-white/60"> Nuevo total </span>

            <strong class="font-barber text-2xl font-normal text-[#ffb700]">
              {{ formatCurrency(totalAmount) }}
            </strong>
          </div>

          <p class="mt-2 text-xs text-white/50">
            {{ sameServices ? "Se conserva el importe de la reserva si no cambias sus servicios." : "El nuevo importe utiliza los precios vigentes de los servicios seleccionados." }} La duración se mantiene en 60 minutos.
          </p>
        </section>
      </template>
    </div>

    <!-- BOTONES -->
    <footer
      class="shrink-0 border-t border-white/10 bg-[#101010] px-3 py-3 sm:px-6 sm:py-4"
    >
      <p v-if="saveError" class="mb-3 text-sm text-red-300" role="alert">
        {{ saveError }}
      </p>

      <p v-else-if="saveHint" class="mb-3 text-xs text-white/60" role="status">
        {{ saveHint }}
      </p>

      <div class="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-3">
        <button
          type="button"
          :disabled="saving"
          @click="handleClose"
          class="min-h-11 rounded-[10px] border border-white/15 px-3 py-2.5 sm:px-[18px] text-[13px] text-white/80 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]"
        >
          Cancelar
        </button>

        <button
          type="button"
          :disabled="!canSave"
          @click="handleSave"
          class="min-h-11 rounded-[10px] bg-[#ffb700] px-3 py-2.5 sm:px-[18px] text-[13px] font-semibold text-[#111] transition-colors hover:bg-[#ffca36] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]"
        >
          {{ saving ? "Guardando…" : "Guardar cambios" }}
        </button>
      </div>
    </footer>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";

import { useToast } from "@/lib/notifications";
import { useUserStore } from "@/stores/user";
import { useBarberStore } from "@/stores/barber";
import { useServiceStore } from "@/stores/service";
import { useSettingsStore } from "@/stores/settings";
import ServicePhoto from "@/components/UI/ServicePhoto.vue";
import BookingCalendar from "@/components/appointments/BookingCalendar.vue";
import BarberPortrait from "@/components/UI/BarberPortrait.vue";
import BarberAPI from "@/api/barberAPI";
import AppointmentsAPI from "@/api/AppointmentsAPI";
import { formatCurrency } from "@/helpers";
import { displayDate } from "@/helpers/date";

interface Service {
  _id: string;
  name: string;
  price: number;
  photoUpdatedAt?: string | null;
}

interface Barber {
  _id: string;
  name: string;
  email?: string;
}

interface Appointment {
  _id: string;
  date: string;
  time: string;
  services: Service[];
  barber: Barber | null;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  totalAmount: number;
}

interface Interval {
  startTime: string;
  endTime: string;
}

interface Schedule {
  schedule: {
    day: number;
    isWorking: boolean;
    startTime?: string;
    endTime?: string;
    breaks: Interval[];
  }[];

  blockedDates: {
    date: string;
    startTime?: string;
    endTime?: string;
  }[];
}

const props = defineProps<{
  visible: boolean;
  appointment: Appointment;
}>();

const emit = defineEmits<{
  (event: "update:visible", value: boolean): void;
  (event: "saved"): void;
}>();

const toast = useToast();
const dialog = ref<HTMLDialogElement | null>(null);

const user = useUserStore(), barberStore = useBarberStore(), serviceStore = useServiceStore(), settings = useSettingsStore();
const isAdmin = computed(() => user.isAdmin);
const adminBarber = ref("");
const selectedBarber = computed(() => isAdmin.value ? adminBarber.value : props.appointment.barber?._id || "");
const selectedProfessional = computed(() => barberStore.barbers.find(item => item._id === selectedBarber.value) ?? props.appointment.barber);
const optionsError = ref(""), optionsLoading = ref(false), serviceSearch = ref("");
const catalog = computed(() => [...serviceStore.services, ...props.appointment.services.filter(original => !serviceStore.services.some(service => service._id === original._id))]);
const serviceOptions = computed(() => catalog.value.filter(service => service.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(serviceSearch.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim())));
const retainsServices = computed(() => selectedServices.value.every(service => props.appointment.services.some(original => original._id === service._id)));
const sameServices = computed(() => retainsServices.value && selectedServices.value.length === props.appointment.services.length);
async function loadEditorOptions() {
  optionsLoading.value = true; optionsError.value = "";
  const appointmentId = props.appointment._id;
  const results = await Promise.allSettled([settings.load(), serviceStore.loadServices(), ...(isAdmin.value ? [barberStore.getBarbers()] : [])]);
  if (!props.visible || appointmentId !== props.appointment._id) { optionsLoading.value = false; return; }
  optionsLoading.value = false;
  if (results.some(result => result.status === "rejected") || settings.error || serviceStore.error || isAdmin.value && barberStore.error) {
    optionsError.value = "No pudimos consultar las opciones de la cita. Vuelve a intentarlo antes de guardar.";
  } else {
    selectedServices.value = selectedServices.value.map(service => ({ ...service, ...(serviceStore.services.find(item => item._id === service._id) ?? {}) }));
  }
}
function chooseBarber(event: Event) {
  adminBarber.value = (event.target as HTMLSelectElement).value;
  selectedTime.value = ""; saveError.value = "";
}
function toggleService(service: Service) {
  if (!isAdmin.value) return;
  if (selectedServices.value.some(item => item._id === service._id)) { removeService(service._id); return; }
  if (selectedServices.value.length < settings.maxServicesPerAppointment) selectedServices.value.push({ ...service });
}

const selectedDate = ref("");
const selectedTime = ref("");
const selectedServices = ref<Service[]>([]);

const schedule = ref<Schedule | null>(null);
const occupied = ref<string[]>([]);
const calendarDays = ref<Record<string, boolean>>({});

const loading = ref(false);
const loadingHours = ref(false);
const saving = ref(false);
const initializing = ref(false);

const scheduleError = ref("");
const hoursError = ref("");
const calendarError = ref("");
const saveError = ref("");

const clock = ref(Date.now());

let requestSequence = 0;
let visibilitySequence = 0;
let clockTimer: ReturnType<typeof setInterval> | undefined;

// FECHA LOCAL
const localKey = (value: Date) =>
  value.getFullYear() +
  "-" +
  String(value.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(value.getDate()).padStart(2, "0");

// FECHA ACTUAL DE ECUADOR
const today = computed(() =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Guayaquil",
  }).format(new Date(clock.value)),
);

// HORA ACTUAL DE ECUADOR
const nowTime = computed(() =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Guayaquil",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(clock.value)),
);

// CONVERSIONES
const minutes = (value: string) =>
  Number(value.slice(0, 2)) * 60 + Number(value.slice(3));

const asTime = (value: number) =>
  String(Math.floor(value / 60)).padStart(2, "0") +
  ":" +
  String(value % 60).padStart(2, "0");

// DATOS ORIGINALES
const originalDate = computed(() => props.appointment.date.slice(0, 10));

const originalBarber = computed(() => props.appointment.barber?._id || "");

// COMPROBAR HORA FUTURA
const isFutureHour = (hour: string) =>
  selectedDate.value > today.value ||
  (selectedDate.value === today.value && hour > nowTime.value);

// COMPROBAR SOLAPAMIENTO
const overlaps = (hour: string, start: string, end: string) =>
  minutes(hour) < minutes(end) && minutes(hour) + 60 > minutes(start);

// HORARIO DEL DÍA
const scheduleDay = computed(() =>
  schedule.value?.schedule.find(
    (day) =>
      day.day === new Date(selectedDate.value + "T12:00:00Z").getUTCDay(),
  ),
);

// BLOQUEOS
const blocks = computed(
  () =>
    schedule.value?.blockedDates.filter(
      (block) => block.date.slice(0, 10) === selectedDate.value,
    ) || [],
);

const isDateFullyBlocked = computed(() =>
  blocks.value.some((block) => !block.startTime || !block.endTime),
);

// GENERAR HORAS
const hours = computed(() => {
  const day = scheduleDay.value;

  if (!day?.isWorking || !day.startTime || !day.endTime) {
    return [];
  }

  const result: string[] = [];

  for (
    let time = minutes(day.startTime);
    time + 60 <= minutes(day.endTime);
    time += 60
  ) {
    result.push(asTime(time));
  }

  return result;
});

// HORAS OCUPADAS
const isHourOccupied = (hour: string) =>
  occupied.value.some((time) =>
    overlaps(hour, time, asTime(minutes(time) + 60)),
  );

// HORAS BLOQUEADAS
const isHourBlocked = (hour: string) =>
  isDateFullyBlocked.value ||
  [
    ...(scheduleDay.value?.breaks || []),
    ...blocks.value.filter((block) => block.startTime && block.endTime),
  ].some((interval) => overlaps(hour, interval.startTime!, interval.endTime!));

// HORA NO DISPONIBLE
const isHourUnavailable = (hour: string) =>
  loadingHours.value ||
  !!scheduleError.value ||
  !!hoursError.value ||
  !hours.value.includes(hour) ||
  !isFutureHour(hour) ||
  isHourOccupied(hour) ||
  isHourBlocked(hour);

// HORAS DISPONIBLES
const availableHours = computed(() =>
  hours.value.filter((hour) => !isHourUnavailable(hour)),
);

// ESTADO DE LA HORA
function hourStatus(hour: string) {
  if (!isHourUnavailable(hour)) {
    return selectedTime.value === hour ? "Seleccionado" : "Disponible";
  }

  if (isHourOccupied(hour)) {
    return "Ya reservado";
  }

  if (isHourBlocked(hour)) {
    return "Bloqueado en la agenda";
  }

  if (!isFutureHour(hour)) {
    return "Hora ya pasada";
  }

  return "Sin turnos libres";
}

// TOTAL DE SERVICIOS
const totalAmount = computed(
  () => sameServices.value ? props.appointment.totalAmount :
    selectedServices.value.reduce(
      (sum, service) => sum + Math.round(service.price * 100),
      0,
    ) / 100,
);

// COMPROBAR CAMBIOS
const hasChanges = computed(
  () =>
    selectedDate.value !== originalDate.value ||
    selectedTime.value !== props.appointment.time ||
    selectedBarber.value !== originalBarber.value ||
    selectedServices.value
      .map((item) => item._id)
      .sort()
      .join(",") !==
      props.appointment.services
        .map((item) => item._id)
        .sort()
        .join(","),
);

// VALIDAR GUARDADO
const canSave = computed(
  () =>
    hasChanges.value &&
    !saving.value &&
    !loading.value &&
    !loadingHours.value &&
    !calendarError.value &&
    !scheduleError.value &&
    !hoursError.value && !optionsError.value && !optionsLoading.value &&
    (!isAdmin.value || barberStore.barbers.some(person => person._id === selectedBarber.value)) &&
    selectedServices.value.length >= 1 &&
    (selectedServices.value.length <= settings.maxServicesPerAppointment || retainsServices.value) &&
    calendarDays.value[selectedDate.value] === true &&
    !!selectedTime.value &&
    !isHourUnavailable(selectedTime.value),
);

// MENSAJE DEL BOTÓN
const saveHint = computed(() => {
  if (saving.value) {
    return "Guardando los cambios. Espera la confirmación.";
  }

  if (loading.value || loadingHours.value || optionsLoading.value) {
    return "Comprobando la disponibilidad real…";
  }

  if (calendarError.value || scheduleError.value || hoursError.value) {
    return "Reintenta la consulta de disponibilidad para guardar.";
  }

  if (!selectedTime.value || isHourUnavailable(selectedTime.value)) {
    return "Elige una hora libre del barbero seleccionado.";
  }

  if (calendarDays.value[selectedDate.value] !== true) {
    return "Esta fecha no tiene turnos libres confirmados. Actualiza la disponibilidad o elige otro día.";
  }

  if (!hasChanges.value) {
    return isAdmin.value ? "Cambia el profesional, los servicios, la fecha o la hora para guardar." : "Cambia la fecha, la hora o quita un servicio para guardar.";
  }

  return "";
});

// FECHAS DESHABILITADAS
function disabledDates(value: Date) {
  const key = localKey(value);

  if (
    key === selectedDate.value &&
    !loadingHours.value &&
    !hoursError.value &&
    !scheduleError.value
  ) {
    return availableHours.value.length === 0;
  }

  return calendarDays.value[key] !== true;
}

// QUITAR SERVICIO
function removeService(id: string) {
  if (selectedServices.value.length > 1 || isAdmin.value) {
    selectedServices.value = selectedServices.value.filter(
      (service) => service._id !== id,
    );
  }
}

// CAMBIAR FECHA
function changeDate(value: string) {
  if (value !== selectedDate.value) {
    selectedTime.value = "";
    selectedDate.value = value;
    saveError.value = "";
  }
}

// CONSULTAR DISPONIBILIDAD
async function refreshAvailability(restoreOriginal = true) {
  if (!props.visible || !selectedBarber.value || !selectedDate.value) {
    return;
  }

  const request = ++requestSequence;

  const barberId = selectedBarber.value;
  const date = selectedDate.value;
  const appointmentId = props.appointment._id;

  loadingHours.value = true;
  scheduleError.value = "";
  hoursError.value = "";
  calendarError.value = "";

  schedule.value = null;
  occupied.value = [];
  calendarDays.value = {};

  clock.value = Date.now();

  const end = new Date(today.value + "T12:00:00");

  end.setMonth(end.getMonth() + 1);

  const results = await Promise.allSettled([
    BarberAPI.getSchedule(barberId),

    AppointmentsAPI.getByDate(date, barberId),

    AppointmentsAPI.calendarAvailability(
      today.value,
      localKey(end),
      barberId,
      appointmentId,
    ),
  ]);

  if (
    request !== requestSequence ||
    !props.visible ||
    selectedBarber.value !== barberId ||
    selectedDate.value !== date ||
    props.appointment._id !== appointmentId
  ) {
    return;
  }

  const [agenda, busy, calendar] = results;

  // AGENDA
  if (agenda.status === "fulfilled" && agenda.value.data?.schedule) {
    schedule.value = agenda.value.data as Schedule;
  } else if (
    agenda.status === "rejected" &&
    agenda.reason?.response?.status !== 404
  ) {
    scheduleError.value = "No pudimos cargar la agenda de este barbero.";
  }

  // HORAS RESERVADAS
  if (busy.status === "fulfilled" && Array.isArray(busy.value.data)) {
    occupied.value = busy.value.data
      .filter((item: { _id: string }) => item._id !== appointmentId)
      .map((item: { time: string }) => item.time);
  } else {
    hoursError.value =
      "No pudimos consultar las horas reservadas. Vuelve a intentarlo.";
  }

  // CALENDARIO
  if (
    calendar.status === "fulfilled" &&
    calendar.value.data?.days &&
    typeof calendar.value.data.days === "object" &&
    !Array.isArray(calendar.value.data.days)
  ) {
    calendarDays.value = calendar.value.data.days;
  } else {
    calendarError.value =
      "No pudimos comprobar los días libres de este barbero.";
  }

  loadingHours.value = false;

  if (selectedTime.value && isHourUnavailable(selectedTime.value)) {
    selectedTime.value = "";
  }

  // RESTAURAR HORA ORIGINAL
  if (
    restoreOriginal &&
    !selectedTime.value &&
    selectedBarber.value === originalBarber.value &&
    selectedDate.value === originalDate.value &&
    !isHourUnavailable(props.appointment.time)
  ) {
    selectedTime.value = props.appointment.time;
  }
}

// CERRAR MODAL
function handleClose() {
  if (!saving.value) {
    dialog.value?.close();
    emit("update:visible", false);
  }
}

// CERRAR AL PULSAR FUERA
function onBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) {
    handleClose();
  }
}

// GUARDAR CAMBIOS
async function handleSave() {
  if (!canSave.value || saving.value) {
    return;
  }

  saving.value = true;
  saveError.value = "";

  try {
    await AppointmentsAPI.update(props.appointment._id, {
      date: selectedDate.value,
      time: selectedTime.value,
      barber: selectedBarber.value,
      services: selectedServices.value.map((service) => service._id),
      totalAmount: totalAmount.value,
      ...(!sameServices.value ? { expectedPrices: selectedServices.value.map(service => ({ service: service._id, price: service.price })) } : {}),
    });

    toast.open({
      message: "Cita actualizada correctamente",
      type: "success",
    });

    emit("saved");
    emit("update:visible", false);

    dialog.value?.close();
  } catch (error: any) {
    saveError.value =
      error?.response?.data?.msg ||
      "No pudimos guardar los cambios. Vuelve a intentarlo.";

    if (error?.response?.data?.code === "SERVICE_LIMIT_CHANGED") await settings.load();
    if (error?.response?.data?.code === "PRICE_CHANGED") await loadEditorOptions();
    if (error?.response?.status === 409 && !["PRICE_CHANGED", "SERVICE_LIMIT_CHANGED"].includes(error?.response?.data?.code)) {
      selectedTime.value = "";

      await refreshAvailability(false);

      saveError.value =
        "La disponibilidad cambió. Conservamos tus servicios; revisa y elige otra hora libre.";
    }

    toast.open({
      message: saveError.value,
      type: "error",
    });
  } finally {
    saving.value = false;
  }
}

// OBSERVAR BARBERO Y FECHA
watch(
  [selectedBarber, selectedDate],
  async () => {
    if (props.visible && !initializing.value) {
      await refreshAvailability();
    }
  },
  { flush: "post" },
);

// VALIDAR HORA ELEGIDA
watch(
  availableHours,
  () => {
    if (
      loadingHours.value ||
      loading.value ||
      scheduleError.value ||
      hoursError.value ||
      !selectedTime.value
    ) {
      return;
    }

    if (isHourUnavailable(selectedTime.value)) {
      selectedTime.value = "";

      saveError.value =
        "El turno elegido ya no está libre. Elige otra hora; tus servicios se conservan.";
    }
  },
  { flush: "post" },
);

// ABRIR Y CERRAR MODAL
watch(
  () => props.visible,
  async (open) => {
    const visibility = ++visibilitySequence;

    requestSequence++;

    clearInterval(clockTimer);

    if (!open) {
      dialog.value?.close();
      return;
    }

    toast.clear();
    initializing.value = true;
    loading.value = true;
    saveError.value = "";

    adminBarber.value = props.appointment.barber?._id || "";
    serviceSearch.value = "";
    selectedDate.value = originalDate.value;

    selectedTime.value = props.appointment.time;

    selectedServices.value = props.appointment.services.map((service) => ({
      ...service,
    }));

    clock.value = Date.now();

    await nextTick();

    if (!props.visible || visibility !== visibilitySequence) {
      return;
    }

    if (!dialog.value?.open) {
      dialog.value?.showModal();
    }

    clockTimer = setInterval(() => {
      clock.value = Date.now();
    }, 30000);

    await Promise.all([refreshAvailability(), loadEditorOptions()]);

    if (!props.visible || visibility !== visibilitySequence) {
      return;
    }

    loading.value = false;

    await nextTick();

    initializing.value = false;
  },
  {
    immediate: true,
    flush: "post",
  },
);

// LIMPIAR EVENTOS
onUnmounted(() => {
  requestSequence++;
  clearInterval(clockTimer);
  dialog.value?.close();
});
</script>

<style scoped>
/* Solo estilos internos del componente BarberPortrait */
.edit-barber-photo :deep(.barber-portrait-icon) {
  width: 44px;
  height: 52px;
}

.edit-barber-photo :deep(.barber-portrait-caption) {
  display: none;
}
</style>
