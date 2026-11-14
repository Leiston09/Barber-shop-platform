<template>
  <div data-work-week-editor class="mt-5 space-y-4">
    <div
      role="group"
      aria-label="Días de mi jornada"
      class="grid grid-cols-4 gap-2 sm:grid-cols-7"
    >
      <button
        v-for="day in days"
        :key="day.day"
        type="button"
        :disabled="disabled"
        :aria-pressed="selectedDay === day.day"
        :aria-label="
          dayName(day.day) + ', ' + (day.isWorking ? 'laboral' : 'libre')
        "
        :aria-controls="panelId"
        @click="selectedDay = day.day"
        class="min-h-14 min-w-0 rounded-lg border px-1.5 py-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] disabled:opacity-40 motion-reduce:transition-none"
        :class="
          errors['day-' + day.day]
            ? 'border-rose-300/40 text-rose-200'
            : selectedDay === day.day
              ? 'border-[#ffb700]/45 bg-[#ffb700]/10 text-[#ffb700]'
              : 'border-white/10 bg-white/[0.015] text-white/65 hover:border-white/25'
        "
      >
        <span class="block text-sm font-medium">{{
          weekDays.find((item) => item.day === day.day)?.short
        }}</span>
        <span
          class="mt-1 block text-[10px] leading-4"
          :class="
            selectedDay === day.day ? 'text-[#ffb700]/70' : 'text-white/35'
          "
          >{{
            errors["day-" + day.day]
              ? "Revisar"
              : day.isWorking
                ? "Laboral"
                : "Libre"
          }}</span
        >
      </button>
    </div>

    <section
      v-if="current"
      :id="panelId"
      :aria-label="'Jornada de ' + dayName(current.day)"
      class="rounded-xl border border-white/10 bg-black/15 p-4 sm:p-5"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h4 class="text-base font-medium">{{ dayName(current.day) }}</h4>
        <div
          role="group"
          :aria-label="'Disponibilidad del ' + dayName(current.day)"
          class="inline-flex gap-1 rounded-lg border border-white/10 bg-[#101010] p-1"
        >
          <button
            type="button"
            :disabled="disabled"
            :aria-pressed="current.isWorking"
            @click="updateDay({ isWorking: true })"
            class="min-h-10 rounded-md px-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-40"
            :class="
              current.isWorking
                ? 'bg-[#ffb700]/10 text-[#ffb700]'
                : 'text-white/45 hover:text-white'
            "
          >
            Laboral
          </button>
          <button
            type="button"
            :disabled="disabled"
            :aria-pressed="!current.isWorking"
            @click="updateDay({ isWorking: false })"
            class="min-h-10 rounded-md px-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-40"
            :class="
              !current.isWorking
                ? 'bg-white/10 text-white'
                : 'text-white/45 hover:text-white'
            "
          >
            Libre
          </button>
        </div>
      </div>

      <template v-if="current.isWorking">
        <div class="mt-5 grid grid-cols-2 gap-3">
          <label class="min-w-0 text-xs text-white/50"
            >Entrada<HourSelect
              :value="current.startTime"
              @input="setTime('startTime', $event)"
              :disabled="disabled"
              :aria-invalid="!!currentError"
              :aria-describedby="currentError ? errorId : undefined"
              class="mt-2 w-full min-w-0"
          /></label>
          <label class="min-w-0 text-xs text-white/50"
            >Salida<HourSelect
              :value="current.endTime"
              @input="setTime('endTime', $event)"
              :disabled="disabled"
              :aria-invalid="!!currentError"
              :aria-describedby="currentError ? errorId : undefined"
              class="mt-2 w-full min-w-0"
          /></label>
        </div>

        <div class="mt-5 border-t border-white/10 pt-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h5 class="text-sm text-white/75">Pausas</h5>
            <button
              type="button"
              :disabled="disabled"
              @click="addPause"
              class="inline-flex min-h-10 items-center gap-1.5 text-xs font-medium text-[#ffb700] disabled:opacity-40"
            >
              <svg
                aria-hidden="true"
                class="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              >
                <path d="M12 5v14M5 12h14" /></svg
              >Añadir pausa
            </button>
          </div>
          <p
            v-if="!current.breaks.length"
            class="mt-1 text-xs leading-5 text-white/40"
          >
            Jornada continua, sin pausas registradas.
          </p>
          <div
            v-for="(pause, index) in current.breaks"
            :key="index"
            class="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem] items-end gap-2"
          >
            <label class="min-w-0 text-xs text-white/45"
              >Desde<HourSelect
                :value="pause.startTime"
                @input="setPause(index, 'startTime', $event)"
                :disabled="disabled"
                :aria-invalid="!!currentError"
                :aria-describedby="currentError ? errorId : undefined"
                class="mt-1 w-full min-w-0"
            /></label>
            <label class="min-w-0 text-xs text-white/45"
              >Hasta<HourSelect
                :value="pause.endTime"
                @input="setPause(index, 'endTime', $event)"
                :disabled="disabled"
                :aria-invalid="!!currentError"
                :aria-describedby="currentError ? errorId : undefined"
                class="mt-1 w-full min-w-0"
            /></label>
            <button
              type="button"
              :disabled="disabled"
              @click="removePause(index)"
              :aria-label="'Eliminar pausa de ' + dayName(current.day)"
              class="flex min-h-11 items-center justify-center rounded-lg text-rose-300 hover:bg-rose-300/5 disabled:opacity-40"
            >
              <svg
                aria-hidden="true"
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5m4-5v5" />
              </svg>
            </button>
          </div>
        </div>

        <p
          v-if="currentError"
          :id="errorId"
          role="alert"
          class="mt-4 text-xs leading-5 text-rose-300"
        >
          {{ currentError }}
        </p>
        <details
          v-else
          class="mt-5 rounded-lg border border-white/10 px-3 py-1"
        >
          <summary
            class="min-h-10 cursor-pointer text-xs leading-10 text-white/60"
          >
            {{ slots.length }} turnos de 60 minutos · Ver horas
          </summary>
          <div class="mb-3 flex flex-wrap gap-2">
            <span
              v-for="slot in slots"
              :key="slot"
              class="rounded-md bg-white/5 px-2 py-1 text-xs tabular-nums text-white/65"
              >{{ slot }}</span
            >
          </div>
          <p class="mb-3 text-xs leading-5 text-white/40">
            Las reservas y ausencias reducen los turnos libres de cada fecha.
          </p>
        </details>
      </template>
      <p v-else class="mt-4 text-sm leading-6 text-white/45">
        Día de descanso. Elige «Laboral» para configurar sus horas y pausas.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import HourSelect from "@/components/UI/HourSelect.vue";
import { computed, ref, useId, watch } from "vue";
import {
  dailySlots,
  weekDays,
  type ScheduleDay,
  type ScheduleBreak,
} from "@/helpers/barberSchedule";

const days = defineModel<ScheduleDay[]>("days", { required: true });
const props = withDefaults(
  defineProps<{ errors: Record<string, string>; disabled?: boolean }>(),
  { disabled: false },
);
const emit = defineEmits<{ change: [] }>();
const selectedDay = ref(1);
const panelId = useId(),
  errorId = useId();
const current = computed(() =>
  days.value.find((day) => day.day === selectedDay.value),
);
const currentError = computed(() => props.errors["day-" + selectedDay.value]);
const slots = computed(() => (current.value ? dailySlots(current.value) : []));
const dayName = (day: number) =>
  weekDays.find((item) => item.day === day)?.name || "";

function updateDay(changes: Partial<ScheduleDay>) {
  if (props.disabled || !current.value) return;
  days.value = days.value.map((day) =>
    day.day === selectedDay.value ? { ...day, ...changes } : day,
  );
  emit("change");
}
function setTime(key: "startTime" | "endTime", event: Event) {
  updateDay({ [key]: (event.target as HTMLInputElement).value });
}
function setPause(index: number, key: keyof ScheduleBreak, event: Event) {
  if (!current.value) return;
  const value = (event.target as HTMLInputElement).value;
  updateDay({
    breaks: current.value.breaks.map((pause, position) =>
      position === index ? { ...pause, [key]: value } : pause,
    ),
  });
}
function addPause() {
  if (current.value)
    updateDay({
      breaks: [
        ...current.value.breaks,
        { startTime: "13:00", endTime: "14:00" },
      ],
    });
}
function removePause(index: number) {
  if (current.value)
    updateDay({
      breaks: current.value.breaks.filter((_, position) => position !== index),
    });
}
watch(
  () => props.errors,
  (errors) => {
    const invalidDay = weekDays.find((day) => errors["day-" + day.day]);
    if (invalidDay) selectedDay.value = invalidDay.day;
  },
  { immediate: true },
);
</script>
