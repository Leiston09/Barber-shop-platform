<!-- src/components/booking/BookingSummary.vue -->

<template>
  <div class="border border-white/5 rounded-2xl bg-white/[0.02] p-5 sm:p-6">
    <p
      class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
    >
      Resumen
    </p>
    <h3 class="font-barber text-lg text-white font-light mb-5">Tu reserva</h3>

    <!-- BARBERO -->
    <div class="mb-4 pb-4 border-b border-white/5">
      <p class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-2">
        Barbero
      </p>
      <div v-if="appointmentBooking.barber" class="flex items-center gap-3">
        <img
          :src="`/img/barbers/barber${barberIndex + 1}.jpg`"
          :alt="appointmentBooking.barber.name"
          class="w-10 h-10 rounded-full object-cover border border-[#ffb700]/30"
        />
        <div class="min-w-0">
          <p class="text-white/85 text-xs truncate">
            {{ appointmentBooking.barber.name }}
          </p>
          <p class="text-white/30 text-[10px] truncate">
            {{ appointmentBooking.barber.email }}
          </p>
        </div>
      </div>
      <p v-else class="text-white/25 text-xs italic">Sin seleccionar</p>
    </div>

    <!-- SERVICIOS -->
    <div class="mb-4 pb-4 border-b border-white/5">
      <p class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-2">
        Servicios
      </p>
      <ul v-if="appointmentBooking.services.length" class="space-y-1.5">
        <li
          v-for="s in appointmentBooking.services"
          :key="s._id"
          class="flex justify-between text-xs gap-3"
        >
          <span class="text-white/70 truncate">{{ s.name }}</span>
          <span class="text-white/40 shrink-0">
            {{ formatCurrency(s.price) }}
          </span>
        </li>
      </ul>
      <p v-else class="text-white/25 text-xs italic">Sin seleccionar</p>
    </div>

    <!-- FECHA / HORA -->
    <div class="mb-4 pb-4 border-b border-white/5">
      <p class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-2">
        Fecha y hora
      </p>
      <p v-if="appointmentBooking.date" class="text-white/70 text-xs">
        {{ displayDate(appointmentBooking.date) }}
      </p>
      <p v-else class="text-white/25 text-xs italic">Sin seleccionar</p>
      <p v-if="appointmentBooking.time" class="text-[#ffb700] text-sm mt-1">
        {{ appointmentBooking.time }}
      </p>
    </div>

    <!-- TOTAL -->
    <div class="flex items-center justify-between">
      <span
        class="text-[9px] uppercase tracking-[0.3em] text-white/35 font-medium"
      >
        Total
      </span>
      <span class="font-barber text-xl text-[#ffb700]">
        {{ formatCurrency(appointmentBooking.totalService) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import { useBarberStore } from "@/stores/barber";
import { formatCurrency } from "@/helpers";
import { displayDate } from "@/helpers/date";

const appointmentBooking = useAppointmentBookingStore();
const barberStore = useBarberStore();

const barberIndex = computed(() => {
  const i = barberStore.barbers.findIndex(
    (b) => b._id === appointmentBooking.barber?._id,
  );
  return i >= 0 ? i : 0;
});
</script>