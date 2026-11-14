<template>
  <div data-booking-availability class="grid gap-5 md:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]">
    <div class="min-w-0">
      <div v-if="calendarLoading" class="booking-message rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]" role="status">
        {{ calendarLoadingText }}
      </div>
      <div v-else-if="calendarError" class="booking-message rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]" role="alert">
        <p>{{ calendarError }}</p>
        <button type="button" class="booking-link mt-3 text-sm text-[#ffbf28] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#ffb700] focus-visible:outline-offset-4" @click="$emit('retryCalendar')">Reintentar</button>
      </div>
      <BookingCalendar v-else :model-value="date" :disabled-dates="disabledDates" @update:model-value="$emit('changeDate', $event)" />
      <slot name="calendar-footer" />
    </div>

    <div class="min-w-0">
      <h3 class="mb-3 font-medium text-white">{{ hoursTitle }}</h3>
      <p v-if="hoursCaption" class="mb-3 text-sm text-white/50">{{ hoursCaption }}</p>
      <div v-if="hoursLoading" class="booking-message rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]" role="status">
        Consultando la agenda…
      </div>
      <div v-else-if="hoursError" class="booking-message rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]" role="alert">
        <p>{{ hoursError }}</p>
        <button type="button" class="booking-link mt-3 text-sm text-[#ffbf28] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#ffb700] focus-visible:outline-offset-4" @click="$emit('retryHours')">Volver a consultar</button>
      </div>
      <div v-else-if="!hasAvailableHours" class="booking-message rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]">
        <slot name="empty">{{ emptyText }}</slot>
      </div>
      <template v-else>
        <slot name="hours-hint" />
        <div data-hour-grid class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div v-for="hour in hours" :key="hour" class="relative min-w-0" :class="hourClass?.(hour)" :data-selected="selectedTime === hour" :data-unavailable="isHourUnavailable(hour)">
            <button type="button"
              class="booking-choice block w-full rounded-[.875rem] border border-[#ffffff20] bg-[#111] px-3 py-3 text-sm transition-[border-color,background-color] duration-150 enabled:hover:border-[#ffb700] enabled:hover:bg-[#ffb70008] aria-pressed:border-[#ffb700] aria-pressed:bg-[#ffb70008] focus-visible:outline-2 focus-visible:outline-[#ffb700] focus-visible:outline-offset-4 disabled:opacity-[.45] motion-reduce:transition-none"
              :class="{ 'hour-unavailable disabled:border-[#ff52527a]! disabled:bg-[#ffffff07]! disabled:text-white! disabled:opacity-100!': isHourUnavailable(hour) }"
              :aria-label="hour + ': ' + hourStatus(hour)"
              :disabled="isHourUnavailable(hour) || disabled"
              :aria-pressed="selectedTime === hour"
              @click="$emit('selectHour', hour)">
              {{ hour }}
              <span class="mt-1 block text-xs" :class="isHourUnavailable(hour) ? 'text-red-400' : selectedTime === hour ? 'text-[#ffb700]' : 'text-green-400'">{{ hourStatus(hour) }}</span>
            </button>
            <slot name="hour-extra" :hour="hour" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BookingCalendar from "./BookingCalendar.vue";

const props = withDefaults(defineProps<{
  date: string;
  disabledDates: (date: Date) => boolean;
  hours: string[];
  selectedTime: string;
  isHourUnavailable: (hour: string) => boolean;
  hourStatus: (hour: string) => string;
  hoursTitle: string;
  hoursCaption?: string;
  calendarLoading?: boolean;
  calendarError?: string;
  calendarLoadingText?: string;
  hoursLoading?: boolean;
  hoursError?: string;
  disabled?: boolean;
  emptyText?: string;
  hourClass?: (hour: string) => string;
}>(), {
  hoursCaption: "",
  calendarLoading: false,
  calendarError: "",
  calendarLoadingText: "Consultando los días disponibles…",
  hoursLoading: false,
  hoursError: "",
  disabled: false,
  emptyText: "No hay turnos libres en esta fecha. Elige otro día en el calendario.",
});
defineEmits<{
  changeDate: [date: string];
  selectHour: [hour: string];
  retryCalendar: [];
  retryHours: [];
}>();
const hasAvailableHours = computed(() => props.hours.some(hour => !props.isHourUnavailable(hour)));
</script>
