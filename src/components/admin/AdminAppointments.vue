<template>
  <div
    class="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-[#ffb700]/30 transition-all duration-300"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 pb-5 border-b border-white/5"
    >
      <div>
        <div class="flex items-center gap-3 mb-3">
          <span class="w-6 h-px bg-[#ffb700]" />

          <span
            class="text-[#ffb700] text-[9px] uppercase tracking-[0.3em] font-medium"
          >
            Reserva
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div>
            <p
              class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
            >
              Fecha
            </p>

            <p class="text-sm text-white/80 font-light">
              {{ displayDate(appointment.date) }}
            </p>
          </div>

          <div>
            <p
              class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
            >
              Hora
            </p>

            <p class="text-sm text-[#ffb700] font-medium">
              {{ appointment.time }}
            </p>
          </div>
        </div>
      </div>

      <div class="sm:text-right">
        <p class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1">
          Cliente
        </p>

        <p class="text-sm text-white/80 font-light">
          {{ appointment.user?.name || "N/A" }}
        </p>

        <p class="text-xs text-white/30 font-light mt-1">
          {{ appointment.user?.email || "N/A" }}
        </p>
      </div>
    </div>

    <div class="py-5">
      <div class="flex items-center justify-between mb-4">
        <p
          class="text-[9px] uppercase tracking-[0.3em] text-white/40 font-medium"
        >
          Servicios solicitados
        </p>

        <span class="text-[9px] text-white/20">
          {{ appointment.services?.length || 0 }}
          {{ appointment.services?.length === 1 ? "servicio" : "servicios" }}
        </span>
      </div>

      <div
        v-if="appointment.services && appointment.services.length > 0"
        class="space-y-3"
      >
        <div
          v-for="service in appointment.services"
          :key="service._id"
          class="flex items-center justify-between gap-4 py-3 px-4 bg-white/[0.02] border border-white/5 rounded-xl"
        >
          <p class="text-sm text-white/70 font-light">
            {{ service.name }}
          </p>

          <p class="text-sm text-[#ffb700] font-medium whitespace-nowrap">
            {{ formatCurrency(service.price) }}
          </p>
        </div>
      </div>

      <p v-else class="text-white/30 text-sm font-light py-3">
        No hay servicios en esta cita
      </p>
    </div>

    <div
      class="pt-5 border-t border-white/5 flex items-center justify-between gap-4"
    >
      <p
        class="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium"
      >
        Total a pagar
      </p>

      <p class="font-barber text-2xl font-medium text-[#ffb700]">
        {{ formatCurrency(appointment.totalAmount || 0) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/helpers";
import { displayDate } from "@/helpers/date";

interface Appointment {
  _id: string;
  date: string;
  time: string;
  totalAmount: number;
  user: {
    name: string;
    email: string;
  } | null;
  services: Array<{
    _id: string;
    name: string;
    price: number;
  }>;
}

defineProps<{
  appointment: Appointment;
}>();
</script>
