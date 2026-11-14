
<template>
  <div class="booking-calendar min-w-0 w-full [&_.dp--theme-dark]:[--dp-background-color:transparent]! [&_.dp--theme-dark]:[--dp-text-color:#ededed]! [&_.dp--theme-dark]:[--dp-hover-color:#203829]! [&_.dp--theme-dark]:[--dp-primary-color:#ffb700]! [&_.dp--theme-dark]:[--dp-primary-text-color:#111]! [&_.dp--theme-dark]:[--dp-border-color:transparent]! [&_.dp--theme-dark]:[--dp-menu-border-color:transparent]! [&_.dp--theme-dark]:[--dp-secondary-color:#929292]! [&_.dp--theme-dark]:[--dp-disabled-color:#301b1b]! [&_.dp--theme-dark]:[--dp-disabled-color-text:#d58b8b]! [&_.dp--theme-dark]:[--dp-icon-color:#bbb]! [&_.dp--theme-dark]:[--dp-border-radius:10px]! [&_.dp--theme-dark]:[--dp-cell-size:36px]! [&_.dp--theme-dark]:[--dp-font-family:inherit]! [&_.dp--theme-dark]:[--dp-font-size:14px]! [&_.dp--theme-dark]:[--dp-menu-min-width:100%]! max-[641px]:[&_.dp--theme-dark]:[--dp-cell-size:34px]! [&_.dp--main]:w-full! [&_.dp--menu]:w-full! [&_.dp--menu]:border-0! [&_.dp--menu-wrapper]:w-full! [&_.dp--calendar-header]:text-[#aaa]! [&_.dp--cell-inner]:rounded-lg! [&_.dp--cell-inner]:[transition:background-color_.25s_ease,color_.25s_ease,transform_.25s_ease,border-color_.25s_ease]! [&_.dp--cell-inner.dp--cell-disabled]:bg-[#301b1b]! [&_.dp--cell-inner.dp--cell-disabled]:text-[#d58b8b]! [&_.dp--cell-inner.dp--cell-disabled]:border! [&_.dp--cell-inner.dp--cell-disabled]:border-solid! [&_.dp--cell-inner.dp--cell-disabled]:border-[#783e3e]! [&_.dp--cell-inner.dp--cell-disabled]:rounded-lg! [&_.dp--cell-inner.dp--cell-disabled]:opacity-70! [&_.dp--cell-inner.dp--cell-disabled]:cursor-not-allowed! [&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active)]:bg-[#14271c]! [&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active)]:text-[#a8dfb6]! [&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active)]:border! [&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active)]:border-solid! [&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active)]:border-[#315c3e]! [&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active):hover]:bg-[#203829]! [&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active):hover]:text-[#baffc9]! [&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active):hover]:[transform:scale(1.06)]! [&_.dp--cell-inner.dp--active:not(.dp--cell-disabled)]:bg-[#ffb700]! [&_.dp--cell-inner.dp--active:not(.dp--cell-disabled)]:text-[#111]! [&_.dp--cell-inner.dp--active:not(.dp--cell-disabled)]:border! [&_.dp--cell-inner.dp--active:not(.dp--cell-disabled)]:border-solid! [&_.dp--cell-inner.dp--active:not(.dp--cell-disabled)]:border-[#ffb700]! [&_.dp--cell-inner.dp--active:not(.dp--cell-disabled)]:font-bold! [&_.dp--today:not(.dp--active):not(.dp--cell-disabled)]:border! [&_.dp--today:not(.dp--active):not(.dp--cell-disabled)]:border-solid! [&_.dp--today:not(.dp--active):not(.dp--cell-disabled)]:border-[#5b956c]! [&_.dp--cell-disabled:hover]:transform-none! [&_.dp--cell-disabled:hover]:bg-[#301b1b]! [&_.dp--cell-offset]:opacity-30! motion-reduce:[&_.dp--cell-inner]:transition-none! motion-reduce:[&_.dp--cell-inner:hover]:transform-none! [.edit-modal_&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active)]:bg-transparent! [.edit-modal_&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active)]:text-[var(--color-green-400,#4ade80)]! [.edit-modal_&_.dp--cell-inner:not(.dp--cell-disabled):not(.dp--active)]:border-[#ffffff20]!">
    <VueDatePicker
      :model-value="modelValue"
      @update:model-value="update"
      model-type="yyyy-MM-dd"
      :locale="es"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-dates="disabledDates"
      :time-config="{ enableTimePicker: false }"
      :config="{ monthChangeOnScroll: false }"
      inline
      auto-apply
      dark
      :teleport="false"
    />

    <!-- LEYENDA DE COLORES -->
    <div class="calendar-legend flex flex-wrap items-center justify-center gap-3.5 mt-[18px] pt-3.5 border-t border-[#ffffff15] max-[641px]:gap-2.5">
      <div class="legend-item flex items-center gap-1.5 text-[#ffffff85] text-[11px] max-[641px]:text-[10px]">
        <span class="legend-dot available size-2 rounded-full shrink-0 bg-[#a8dfb6] shadow-[0_0_6px_#a8dfb640]"></span>
        <span>Habilitado</span>
      </div>

      <div class="legend-item flex items-center gap-1.5 text-[#ffffff85] text-[11px] max-[641px]:text-[10px]">
        <span class="legend-dot unavailable size-2 rounded-full shrink-0 bg-[#d58b8b] shadow-[0_0_6px_#d58b8b40]"></span>
        <span>No disponible</span>
      </div>

      <div class="legend-item flex items-center gap-1.5 text-[#ffffff85] text-[11px] max-[641px]:text-[10px]">
        <span class="legend-dot selected size-2 rounded-full shrink-0 bg-[#ffb700] shadow-[0_0_6px_#ffb70050]"></span>
        <span>Seleccionado</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { es } from "date-fns/locale";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";

defineProps<{
  modelValue: string;
  disabledDates?: (date: Date) => boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const booking = useAppointmentBookingStore();

// FECHA MÍNIMA
const minDate = computed(() => {
  return new Date(booking.today() + "T00:00:00");
});

// FECHA MÁXIMA: UN MES
const maxDate = computed(() => {
  const end = new Date(booking.today() + "T00:00:00");
  end.setMonth(end.getMonth() + 1);
  return end;
});

// ACTUALIZAR FECHA SELECCIONADA
function update(value: unknown) {
  if (typeof value === "string") {
    emit("update:modelValue", value);
  }
}
</script>
