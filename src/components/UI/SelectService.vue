<template>
  <div
    class="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#ffb700]/30 transition-all duration-300"
  >
    <!-- INFO DEL SERVICIO -->
    <div>
      <p
        class="font-barber text-lg sm:text-xl font-light text-white tracking-wide"
      >
        {{ service.name }}
      </p>

      <p
        class="font-barber text-2xl sm:text-3xl font-medium text-[#ffb700] mt-1"
      >
        {{ formatCurrency(service.price) }}
      </p>
    </div>

    <!-- BOTÓN ELIMINAR -->
    <div class="flex items-center">
      <button
        type="button"
        @click="appointmentBooking.deleteService(service._id)"
        class="px-4 py-2 text-[10px] font-barber uppercase tracking-[0.2em] border border-red-500/30 text-red-400/80 hover:text-red-300 hover:border-red-500/60 hover:bg-red-500/5 transition-all duration-300 rounded"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/helpers";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";

interface Service {
  _id: string;
  name: string;
  price: number;
}

defineProps<{
  service: Service;
}>();

const appointmentBooking =
  useAppointmentBookingStore();
</script>

<style scoped></style>