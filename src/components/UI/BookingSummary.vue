<template>
  <div class="border border-white/5 rounded-2xl bg-white/[0.02] p-5 sm:p-6">
    <p class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1">
      Resumen
    </p>

    <h3 class="font-barber text-lg text-white font-light mb-5">
      Tu reserva
    </h3>

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

      <p v-else class="text-white/25 text-xs italic">
        Sin seleccionar
      </p>
    </div>

    <!-- SERVICIOS -->
    <div class="mb-4 pb-4 border-b border-white/5">
      <p class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-2">
        Servicios
      </p>

      <ul
        v-if="appointmentBooking.services.length"
        class="space-y-1.5"
      >
        <li
          v-for="service in appointmentBooking.services"
          :key="service._id"
          class="flex justify-between text-xs gap-3"
        >
          <span class="text-white/70 truncate">
            {{ service.name }}
          </span>

          <span class="text-white/40 shrink-0">
            {{ formatCurrency(service.price) }}
          </span>
        </li>
      </ul>

      <p v-else class="text-white/25 text-xs italic">
        Sin seleccionar
      </p>
    </div>

    <!-- FECHA Y HORA -->
    <div class="mb-4 pb-4 border-b border-white/5">
      <p class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-2">
        Fecha y hora
      </p>

      <p
        v-if="appointmentBooking.date"
        class="text-white/70 text-xs"
      >
        {{ displayDate(appointmentBooking.date) }}
      </p>

      <p v-else class="text-white/25 text-xs italic">
        Sin seleccionar
      </p>

      <p
        v-if="appointmentBooking.time"
        class="text-[#ffb700] text-sm mt-1"
      >
        {{ appointmentBooking.time }}
      </p>
    </div>

    <!-- TOTAL -->
    <div class="flex items-center justify-between mb-5">
      <span
        class="text-[9px] uppercase tracking-[0.3em] text-white/35 font-medium"
      >
        Total
      </span>

      <span class="font-barber text-xl text-[#ffb700]">
        {{ formatCurrency(appointmentBooking.totalService) }}
      </span>
    </div>

    <!-- BOTÓN SEGÚN EL PASO -->
    <RouterLink
      v-if="nextStep && route.name !== 'New-Appointments-details'"
      :to="{ name: nextStep.route }"
      class="flex items-center justify-center w-full px-4 py-3.5 rounded-xl bg-[#ffb700] text-black text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-center hover:bg-[#e6a500] transition-colors active:scale-[0.98]"
    >
      {{ nextStep.label }}
    </RouterLink>

    <button
      v-if="route.name === 'New-Appointments-details' && nextStep"
      type="button"
      :disabled="!appointmentBooking.validateReservation"
      @click="handleSave"
      class="w-full text-center px-4 py-3.5 rounded-xl bg-[#ffb700] text-black text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] hover:bg-[#e6a500] transition-colors active:scale-[0.98] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
    >
      Confirmar Reservación
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import { useBarberStore } from "@/stores/barber";
import { useToast } from "vue-toast-notification";
import { formatCurrency } from "@/helpers";
import { displayDate } from "@/helpers/date";

const route = useRoute();
const appointmentBooking = useAppointmentBookingStore();
const barberStore = useBarberStore();
const toast = useToast();

const barberIndex = computed(() => {
  const index = barberStore.barbers.findIndex(
    (barber) => barber._id === appointmentBooking.barber?._id,
  );

  return index >= 0 ? index : 0;
});

const handleSave = () => {
  appointmentBooking.saveAppointment(toast);
};

const nextStep = computed(() => {
  if (route.name === "BarberSelect") {
    return appointmentBooking.barber
      ? {
          label: "Continuar con servicios",
          route: "New-appointments",
        }
      : null;
  }

  if (route.name === "New-appointments") {
    return appointmentBooking.barber &&
      appointmentBooking.services.length > 0
      ? {
          label: "Continuar con fecha y hora",
          route: "New-Appointments-details",
        }
      : null;
  }

  if (route.name === "New-Appointments-details") {
    return appointmentBooking.barber &&
      appointmentBooking.services.length > 0 &&
      appointmentBooking.date &&
      appointmentBooking.time
      ? {
          label: "Confirmar reservación",
          route: "New-Appointments-confirm",
        }
      : null;
  }

  return null;
});
</script>