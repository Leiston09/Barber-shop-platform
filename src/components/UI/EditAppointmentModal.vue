<!-- src/components/UI/EditAppointmentModal.vue -->

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      @click.self="handleClose"
    >
      <Transition
        appear
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4 scale-[0.98]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
      >
        <div
          class="w-full max-w-3xl bg-[#0b0b0b] border border-white/10 rounded-2xl p-5 sm:p-7 my-auto relative"
        >
          <!-- LÍNEA DORADA SUPERIOR -->
          <div
            class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700] to-transparent"
          />

          <!-- HEADER -->
          <div class="flex items-start justify-between mb-5">
            <div>
              <p
                class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
              >
                Reprogramar
              </p>
              <h2 class="font-barber text-xl sm:text-2xl text-white font-light">
                Modificar tu cita
              </h2>
            </div>

            <button
              type="button"
              @click="handleClose"
              class="text-white/35 hover:text-white text-lg leading-none transition"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <!-- CITA ACTUAL (referencia) -->
          <div
            class="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 mb-5"
          >
            <p class="text-[8px] uppercase tracking-[0.25em] text-white/30 mb-2">
              Cita actual
            </p>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span class="text-white/70">
                {{ originalDateFormatted }}
              </span>
              <span class="text-[#ffb700]">{{ appointment.time }}</span>
              <span class="text-white/45">
                {{ appointment.barber?.name || "—" }}
              </span>
            </div>
          </div>

          <!-- LOADING INICIAL (solo al abrir) -->
          <div
            v-if="loading"
            class="py-16 flex flex-col items-center justify-center"
          >
            <div
              class="w-7 h-7 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
            />
            <p class="text-white/30 text-[9px] uppercase tracking-[0.3em] mt-4">
              Cargando disponibilidad...
            </p>
          </div>

          <template v-else>
            <!-- BARBERO -->
            <div class="mb-5">
              <label
                class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
              >
                Barbero
              </label>
              <select
                v-model="selectedBarber"
                class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffb700]/50 transition"
              >
                <option
                  v-for="b in barberStore.barbers"
                  :key="b._id"
                  :value="b._id"
                >
                  {{ b.name }}
                </option>
              </select>
            </div>

            <!-- CALENDARIO + HORAS -->
            <div
              class="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-5 mb-5"
            >
              <!-- CALENDARIO -->
              <div
                class="border border-white/5 rounded-xl bg-white/[0.02] p-4"
              >
                <p
                  class="text-[9px] uppercase tracking-[0.25em] text-white/30 mb-3"
                >
                  Nueva fecha
                </p>
                <div class="w-full flex justify-center">
                  <VueDatePicker
                    v-model="selectedDate"
                    :disabled-dates="disabledDates"
                    :time-config="{ enableTimePicker: false }"
                    model-type="yyyy-MM-dd"
                    format="dd/MM/yyyy"
                    :month-change-on-scroll="false"
                    :prevent-min-max-navigation="true"
                    auto-apply
                    dark
                    :locale="es"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :teleport="false"
                    inline
                  />
                </div>
              </div>

              <!-- HORAS -->
              <div
                class="border border-white/5 rounded-xl bg-white/[0.02] p-4 relative"
              >
                <div class="flex items-center justify-between mb-3">
                  <p
                    class="text-[9px] uppercase tracking-[0.25em] text-white/30"
                  >
                    Nueva hora
                  </p>
                  <div
                    v-if="!noSchedule && selectedDate && !loadingHours"
                    class="flex items-center gap-3 text-[8px] uppercase tracking-[0.15em]"
                  >
                    <span class="text-white/45">
                      {{ availableHours.length }} libres
                    </span>
                  </div>
                </div>

                <!-- MINI LOADER (solo en este panel) -->
                <div
                  v-if="loadingHours"
                  class="min-h-[180px] flex flex-col items-center justify-center"
                >
                  <div
                    class="w-5 h-5 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
                  />
                  <p class="text-white/25 text-[8px] uppercase tracking-[0.3em] mt-3">
                    Cargando horas...
                  </p>
                </div>

                <!-- SIN HORARIO -->
                <div
                  v-else-if="noSchedule"
                  class="min-h-[180px] flex items-center justify-center text-center px-4"
                >
                  <p class="text-amber-400/80 text-xs">
                    Este profesional no tiene horario configurado.
                  </p>
                </div>

                <!-- SIN FECHA -->
                <div
                  v-else-if="!selectedDate"
                  class="min-h-[180px] flex items-center justify-center text-center px-4"
                >
                  <p class="text-white/30 text-xs">
                    Selecciona una fecha para ver horarios
                  </p>
                </div>

                <!-- DÍA NO DISPONIBLE -->
                <div
                  v-else-if="!isDayWorking || isDateFullyBlocked"
                  class="min-h-[180px] flex items-center justify-center text-center px-4"
                >
                  <p class="text-white/30 text-xs">
                    Este día no está disponible
                  </p>
                </div>

                <!-- SIN HORAS -->
                <div
                  v-else-if="hours.length === 0"
                  class="min-h-[180px] flex items-center justify-center text-center px-4"
                >
                  <p class="text-white/30 text-xs">
                    Sin horarios para este día
                  </p>
                </div>

                <!-- GRID DE HORAS -->
                <div
                  v-else
                  class="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto pr-1"
                >
                  <button
                    v-for="hour in hours"
                    :key="hour"
                    type="button"
                    :disabled="isHourUnavailable(hour)"
                    @click="selectedTime = hour"
                    :class="[
                      'relative py-2.5 text-xs font-barber uppercase tracking-[0.08em] border rounded-lg transition-all duration-200',
                      selectedTime === hour
                        ? 'bg-[#ffb700] text-black border-[#ffb700] shadow-lg shadow-[#ffb700]/20'
                        : isHourOccupied(hour)
                          ? 'bg-white/[0.02] text-white/15 border-white/5 cursor-not-allowed line-through'
                          : isHourBlocked(hour)
                            ? 'bg-amber-500/[0.03] text-amber-400/40 border-amber-500/15 cursor-not-allowed line-through'
                            : 'bg-transparent text-white/60 border-white/10 hover:text-white hover:border-[#ffb700]/50 hover:bg-[#ffb700]/5',
                    ]"
                  >
                    {{ hour }}
                    <span
                      v-if="isHourOccupied(hour)"
                      class="absolute top-1 right-1 w-1 h-1 rounded-full bg-red-500/50"
                    />
                    <span
                      v-else-if="isHourBlocked(hour)"
                      class="absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-400/60"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- SERVICIOS (bloqueados) -->
            <div
              class="border border-white/5 rounded-xl bg-white/[0.02] p-4 mb-5"
            >
              <div class="flex items-center justify-between mb-3">
                <p
                  class="text-[9px] uppercase tracking-[0.25em] text-white/30"
                >
                  Servicios
                </p>
                <span class="text-[9px] text-white/25 italic">
                  No editables
                </span>
              </div>

              <ul class="space-y-1.5">
                <li
                  v-for="s in appointment.services"
                  :key="s._id"
                  class="flex justify-between text-xs gap-3"
                >
                  <span class="text-white/65 truncate">{{ s.name }}</span>
                  <span class="text-white/40 shrink-0 font-barber">
                    {{ formatCurrency(s.price) }}
                  </span>
                </li>
              </ul>

              <div
                class="flex justify-between pt-3 mt-3 border-t border-white/5"
              >
                <span class="text-[9px] uppercase tracking-[0.25em] text-white/35">
                  Total
                </span>
                <span class="font-barber text-lg text-[#ffb700]">
                  {{ formatCurrency(appointment.totalAmount) }}
                </span>
              </div>
            </div>

            <!-- ACCIONES -->
            <div
              class="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-white/5"
            >
              <button
                type="button"
                @click="handleClose"
                :disabled="saving"
                class="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition disabled:opacity-40"
              >
                Regresar
              </button>

              <button
                type="button"
                :disabled="!hasChanges || saving || !selectedTime"
                @click="handleSave"
                class="px-5 py-2.5 bg-[#ffb700] text-black text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-[#ffb700]/90 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {{ saving ? "Guardando..." : "Guardar cambios" }}
              </button>
            </div>
          </template>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { es } from "date-fns/locale";
import { useToast } from "vue-toast-notification";

import { useBarberStore } from "@/stores/barber";
import BarberAPI from "@/api/barberAPI";
import AppointmentsAPI from "@/api/AppointmentsAPI";
import { formatCurrency } from "@/helpers";
import { displayDate } from "@/helpers/date";

/* =========================================================
   TIPOS
   ========================================================= */
interface Service {
  _id: string;
  name: string;
  price: number;
}

interface Barber {
  _id: string;
  name: string;
  email: string;
}

interface Appointment {
  _id: string;
  date: string;
  services: Service[];
  time: string;
  user: { _id: string; name: string; email: string } | null;
  barber: Barber | null;
  totalAmount: number;
}

interface ScheduleDay {
  day: number;
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
  breaks: { startTime: string; endTime: string }[];
}

interface BlockedDate {
  date: string;
  startTime?: string;
  endTime?: string;
}

interface Schedule {
  schedule: ScheduleDay[];
  blockedDates: BlockedDate[];
}

/* =========================================================
   PROPS / EMITS
   ========================================================= */
const props = defineProps<{
  visible: boolean;
  appointment: Appointment;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "saved"): void;
}>();

/* =========================================================
   STORES / TOAST
   ========================================================= */
const barberStore = useBarberStore();
const toast = useToast();

/* =========================================================
   ESTADO
   ========================================================= */
const selectedBarber = ref("");
const selectedDate = ref("");
const selectedTime = ref("");

// Solo la carga inicial (al abrir el modal)
const loading = ref(false);
// Carga de horas ocupadas (mini spinner del panel derecho)
const loadingHours = ref(false);

const saving = ref(false);
const initializing = ref(false);

const schedule = ref<Schedule | null>(null);
const occupied = ref<string[]>([]);

/* =========================================================
   CACHÉS
   - schedulesCache[barberId] → Schedule
   - occupiedCache["barberId|date"] → string[]
   ========================================================= */
const schedulesCache = ref<Record<string, Schedule | null>>({});
const occupiedCache = ref<Record<string, string[]>>({});

const occupiedCacheKey = (barberId: string, date: string) =>
  `${barberId}|${date}`;

/* =========================================================
   FECHAS
   ========================================================= */
const minDate = new Date();

const maxDate = computed(() => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d;
});

const toKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const toDateOnly = (raw: string | Date): string => {
  if (typeof raw === "string") return raw.slice(0, 10);
  const y = raw.getFullYear();
  const m = String(raw.getMonth() + 1).padStart(2, "0");
  const d = String(raw.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const originalDateFormatted = computed(() => {
  return displayDate(props.appointment.date);
});

/* =========================================================
   HELPERS DE COMPARACIÓN CON LA CITA ORIGINAL
   ========================================================= */
const originalBarberId = computed(
  () => props.appointment.barber?._id || "",
);

const originalDateKey = computed(() =>
  toDateOnly(props.appointment.date),
);

const isOnOriginalSlot = computed(
  () =>
    selectedBarber.value === originalBarberId.value &&
    selectedDate.value === originalDateKey.value,
);

/* =========================================================
   HORARIO / DISPONIBILIDAD
   ========================================================= */
const toMinutes = (t: string): number => {
  const parts = t.split(":").map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  return h * 60 + m;
};

const toTime = (m: number): string => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

const dayIndexFor = (key: string): number => {
  const parts = key.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d).getDay();
};

const scheduleDayFor = computed<ScheduleDay | null>(() => {
  if (!schedule.value || !selectedDate.value) return null;
  const idx = dayIndexFor(selectedDate.value);
  return schedule.value.schedule.find((d) => d.day === idx) || null;
});

const isDayWorking = computed(
  () => Boolean(scheduleDayFor.value?.isWorking),
);

const isDateFullyBlocked = computed(() => {
  if (!schedule.value || !selectedDate.value) return false;
  const key = selectedDate.value;

  return schedule.value.blockedDates.some((b) => {
    const bKey = toDateOnly(b.date);
    const noHours = !b.startTime && !b.endTime;
    return bKey === key && noHours;
  });
});

const hours = computed<string[]>(() => {
  const day = scheduleDayFor.value;
  if (!day?.isWorking || !day.startTime || !day.endTime) return [];

  const start = toMinutes(day.startTime);
  const end = toMinutes(day.endTime);
  const arr: string[] = [];
  for (let m = start; m < end; m += 60) arr.push(toTime(m));
  return arr;
});

const blockedHoursSet = computed<Set<string>>(() => {
  const set = new Set<string>();
  const day = scheduleDayFor.value;

  if (day?.isWorking && day.breaks) {
    for (const p of day.breaks) {
      const s = toMinutes(p.startTime);
      const e = toMinutes(p.endTime);
      for (let m = s; m < e; m += 60) set.add(toTime(m));
    }
  }

  if (schedule.value && selectedDate.value) {
    for (const b of schedule.value.blockedDates) {
      if (toDateOnly(b.date) !== selectedDate.value) continue;
      if (!b.startTime || !b.endTime) continue;
      const s = toMinutes(b.startTime);
      const e = toMinutes(b.endTime);
      for (let m = s; m < e; m += 60) set.add(toTime(m));
    }
  }

  return set;
});

const occupiedSet = computed<Set<string>>(() => {
  const sameBarber = selectedBarber.value === originalBarberId.value;
  const sameDate = selectedDate.value === originalDateKey.value;

  return new Set(
    occupied.value.filter((t) => {
      if (sameBarber && sameDate && t === props.appointment.time) {
        return false;
      }
      return true;
    }),
  );
});

const isHourOccupied = (h: string) => occupiedSet.value.has(h);
const isHourBlocked = (h: string) => blockedHoursSet.value.has(h);

const isHourUnavailable = (h: string) =>
  isHourOccupied(h) || isHourBlocked(h);

const availableHours = computed(() =>
  hours.value.filter((h) => !isHourUnavailable(h)),
);

const noSchedule = computed(() => !loading.value && !schedule.value);

const disabledDates = (d: Date): boolean => {
  if (!schedule.value) return false;

  const key = toKey(d);
  const today = toKey(new Date());

  if (key < today) return true;

  const idx = d.getDay();
  const day = schedule.value.schedule.find((s) => s.day === idx);
  if (!day || !day.isWorking) return true;

  const fullBlocked = schedule.value.blockedDates.some((b) => {
    const bKey = toDateOnly(b.date);
    const noHours = !b.startTime && !b.endTime;
    return bKey === key && noHours;
  });

  return fullBlocked;
};

/* =========================================================
   CAMBIOS DETECTADOS
   ========================================================= */
const hasChanges = computed(() => {
  if (!props.appointment) return false;

  return (
    selectedBarber.value !== originalBarberId.value ||
    selectedDate.value !== originalDateKey.value ||
    selectedTime.value !== props.appointment.time
  );
});

/* =========================================================
   CARGA DE DATOS (con caché)
   ========================================================= */
const loadScheduleFor = async (
  barberId: string,
  force = false,
): Promise<Schedule | null> => {
  if (!barberId) return null;

  // Si está en caché y no forzamos → devolver directo
  if (!force && barberId in schedulesCache.value) {
    return schedulesCache.value[barberId] ?? null;
  }

  try {
    const { data } = await BarberAPI.getSchedule(barberId);
    schedulesCache.value[barberId] = data as Schedule;
    return data as Schedule;
  } catch {
    schedulesCache.value[barberId] = null;
    return null;
  }
};

const loadOccupied = async (
  date: string,
  barberId: string,
  force = false,
): Promise<string[]> => {
  if (!date || !barberId) return [];

  const key = occupiedCacheKey(barberId, date);

  // Si está en caché y no forzamos → devolver directo
  if (!force && key in occupiedCache.value) {
    return occupiedCache.value[key] ?? [];
  }

  try {
    const { data } = await AppointmentsAPI.getByDate(date, barberId);
    const times = (data as { time: string }[]).map((a) => a.time);
    occupiedCache.value[key] = times;
    return times;
  } catch {
    occupiedCache.value[key] = [];
    return [];
  }
};

/**
 * Aplica la hora correcta tras cambiar barbero o fecha:
 * - Si volvemos a la combinación original → restaurar la hora original.
 * - Si no → limpiar la selección.
 */
const applyTimeForCurrentSlot = () => {
  if (isOnOriginalSlot.value) {
    selectedTime.value = props.appointment.time;
  } else {
    selectedTime.value = "";
  }
};

/* =========================================================
   CERRAR
   ========================================================= */
const handleClose = () => {
  if (saving.value) return;
  emit("update:visible", false);
};

/* =========================================================
   GUARDAR
   ========================================================= */
const handleSave = async () => {
  if (!hasChanges.value || !selectedTime.value) return;

  saving.value = true;

  try {
    await AppointmentsAPI.update(props.appointment._id, {
      date: selectedDate.value,
      time: selectedTime.value,
      barber: selectedBarber.value,
      services: props.appointment.services.map((s) => s._id),
      totalAmount: props.appointment.totalAmount,
    });

    toast.open({
      message: "Cita actualizada correctamente",
      type: "success",
    });

    // Invalidar caché de ocupados para el slot nuevo (por si otro usuario reserva)
    const key = occupiedCacheKey(selectedBarber.value, selectedDate.value);
    delete occupiedCache.value[key];

    emit("saved");
    emit("update:visible", false);
  } catch (err: any) {
    toast.open({
      message:
        err?.response?.data?.msg || "Error al actualizar la cita",
      type: "error",
    });
  } finally {
    saving.value = false;
  }
};

/* =========================================================
   WATCHERS
   ========================================================= */

// Al abrir el modal → inicializar con datos de la cita
watch(
  () => props.visible,
  async (open) => {
    if (!open) return;

    initializing.value = true;

    if (barberStore.barbers.length === 0) {
      await barberStore.getBarbers();
    }

    selectedBarber.value = originalBarberId.value;
    selectedDate.value = originalDateKey.value;

    // Spinner grande solo la primera vez
    loading.value = true;

    const [sched, occ] = await Promise.all([
      loadScheduleFor(selectedBarber.value),
      loadOccupied(selectedDate.value, selectedBarber.value),
    ]);

    schedule.value = sched;
    occupied.value = occ;

    loading.value = false;

    selectedTime.value = props.appointment.time;

    await nextTick();
    initializing.value = false;
  },
  { immediate: true },
);

watch(selectedBarber, async (newBarber, oldBarber) => {
  if (!props.visible) return;
  if (initializing.value) return;
  if (newBarber === oldBarber) return;

  // Aplicar hora inmediatamente
  applyTimeForCurrentSlot();

  // Schedule: si ya está en caché, no hay fetch → no mostramos spinner
  const cachedSchedule = newBarber in schedulesCache.value;
  const cachedOccupied =
    occupiedCacheKey(newBarber, selectedDate.value) in occupiedCache.value;

  const needsFetch = !cachedSchedule || !cachedOccupied;

  if (needsFetch) loadingHours.value = true;

  const [sched, occ] = await Promise.all([
    loadScheduleFor(newBarber),
    loadOccupied(selectedDate.value, newBarber),
  ]);

  schedule.value = sched;
  occupied.value = occ;

  loadingHours.value = false;

  // Reaplicar por si acaso
  applyTimeForCurrentSlot();
});

watch(selectedDate, async (newDate, oldDate) => {
  if (!props.visible) return;
  if (initializing.value) return;
  if (newDate === oldDate) return;

  applyTimeForCurrentSlot();

  const cachedOccupied =
    occupiedCacheKey(selectedBarber.value, newDate) in occupiedCache.value;

  if (!cachedOccupied) loadingHours.value = true;

  const occ = await loadOccupied(newDate, selectedBarber.value);
  occupied.value = occ;

  loadingHours.value = false;

  applyTimeForCurrentSlot();
});
</script>

<style scoped>
:deep(.dp__theme_dark) {
  --dp-background-color: #0a0a0a;
  --dp-text-color: rgba(255, 255, 255, 0.8);
  --dp-hover-color: rgba(255, 183, 0, 0.08);
  --dp-hover-text-color: #ffffff;
  --dp-hover-icon-color: #ffb700;
  --dp-primary-color: #ffb700;
  --dp-primary-text-color: #000000;
  --dp-secondary-color: rgba(255, 255, 255, 0.25);
  --dp-border-color: rgba(255, 255, 255, 0.08);
  --dp-menu-border-color: rgba(255, 255, 255, 0.08);
  --dp-border-color-hover: rgba(255, 183, 0, 0.5);
  --dp-disabled-color: rgba(255, 255, 255, 0.12);
  --dp-disabled-color-text: rgba(255, 255, 255, 0.15);
  --dp-icon-color: rgba(255, 255, 255, 0.4);
  --dp-calendar-header-color: rgba(255, 255, 255, 0.7);
  --dp-month-year-menu-color: #0a0a0a;
  --dp-menu-min-width: 100%;
}

:deep(.dp__main) {
  width: 100%;
}

:deep(.dp__menu) {
  width: 100%;
  border: none;
  background: transparent;
  position: static !important;
}

:deep(.dp__outer_menu_wrap) {
  width: 100%;
}

:deep(.dp__calendar_header) {
  color: rgba(255, 255, 255, 0.35);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

:deep(.dp__calendar_header_item) {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.dp__cell_inner) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.dp__today) {
  border: 1px solid rgba(255, 183, 0, 0.5);
}

:deep(.dp__active_date) {
  background: #ffb700;
  color: #000000;
}

:deep(.dp__month_year_select) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.dp__inner_nav:hover) {
  background: rgba(255, 183, 0, 0.1);
}

:deep(.dp__action_row) {
  display: none;
}
</style>