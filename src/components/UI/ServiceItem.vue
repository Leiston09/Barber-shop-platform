<!-- src/components/UI/ServiceItem.vue -->

<template>
  <div
    class="group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300"
    :class="
      selected
        ? 'bg-[#ffb700]/[0.06] border-[#ffb700]/60 shadow-[0_0_30px_rgba(255,183,0,0.06)]'
        : 'bg-white/[0.02] border-white/10 hover:border-[#ffb700]/40 hover:bg-white/[0.03]'
    "
    @click="appointmentBooking.onServiceSelect(service)"
  >
    <!-- Borde izquierdo de color -->
    <span
      :class="[
        'absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full transition-all duration-300',
        selected ? 'bg-[#ffb700]' : 'bg-white/5 group-hover:bg-[#ffb700]/30',
      ]"
    />

    <div class="flex items-start gap-4 sm:gap-6 px-5 sm:px-6 py-5 pl-6 sm:pl-8">
      <!-- NÚMERO GRANDE -->
      <span
        :class="[
          'font-barber text-3xl sm:text-4xl font-light leading-none shrink-0 transition-colors duration-300 w-12 pt-1',
          selected
            ? 'text-[#ffb700]'
            : 'text-white/15 group-hover:text-white/30',
        ]"
      >
        {{ number }}
      </span>

      <!-- NOMBRE + ESTADO -->
      <div class="flex-1 min-w-0">
        <p
          :class="[
            'font-barber text-lg sm:text-xl font-light tracking-wide leading-snug break-words transition-colors duration-300',
            selected ? 'text-white' : 'text-white/85',
          ]"
        >
          {{ service.name }}
        </p>

        <p
          class="text-[9px] uppercase tracking-[0.25em] mt-1.5 transition-colors duration-300"
          :class="selected ? 'text-[#ffb700]/70' : 'text-white/25'"
        >
          {{ selected ? "Seleccionado" : "Toca para elegir" }}
        </p>
      </div>

      <!-- PRECIO + CHECK -->
      <div class="flex items-center gap-4 shrink-0 pt-1">
        <span
          :class="[
            'font-barber text-xl sm:text-2xl transition-colors duration-300',
            selected ? 'text-[#ffb700]' : 'text-white/70',
          ]"
        >
          {{ formatCurrency(service.price) }}
        </span>

        <div
          :class="[
            'w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300',
            selected
              ? 'bg-[#ffb700] border-[#ffb700] text-black scale-100'
              : 'border-white/15 text-transparent scale-95 group-hover:border-white/30',
          ]"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- LÍNEA INFERIOR DECORATIVA -->
    <div
      class="absolute bottom-0 left-0 right-0 h-px transition-all duration-500"
      :class="
        selected
          ? 'bg-gradient-to-r from-transparent via-[#ffb700]/40 to-transparent'
          : 'bg-transparent'
      "
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatCurrency } from "@/helpers";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import { useServiceStore } from "@/stores/service";

interface Service {
  _id: string;
  name: string;
  price: number;
}

const props = defineProps<{
  service: Service;
}>();

const appointmentBooking = useAppointmentBookingStore();
const serviceStore = useServiceStore();

const selected = computed(() =>
  appointmentBooking.isServiceSelected(props.service._id),
);

const number = computed(() => {
  const idx = serviceStore.services.findIndex(
    (s) => s._id === props.service._id,
  );
  return String(idx + 1).padStart(2, "0");
});
</script>

<style scoped></style>