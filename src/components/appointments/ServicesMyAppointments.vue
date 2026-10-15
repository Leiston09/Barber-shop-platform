<template>
  <div>
    <!-- ENCABEZADO -->
    <div class="mb-6 sm:mb-8">
      <p
        class="text-[#ffb700] text-[9px] uppercase tracking-[0.3em] font-medium"
      >
        Tus reservas
      </p>

      <h2
        class="font-barber text-xl sm:text-2xl lg:text-3xl font-light text-white tracking-tight mt-3"
      >
        Administra tus
        <span class="text-[#ffb700] font-medium">citas.</span>
      </h2>

      <p
        class="text-white/40 text-xs sm:text-sm font-light mt-2 max-w-md"
      >
        A continuación podrás administrar tus próximas citas.
      </p>
    </div>

    <!-- CARGANDO -->
    <div
      v-if="appointments.loading"
      class="text-center flex flex-col items-center justify-center min-h-[55vh] sm:min-h-[50vh]"
    >
      <div
        class="w-8 h-8 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
      ></div>

      <p class="text-white/40 text-xs uppercase tracking-[0.3em] mt-4">
        Cargando citas
      </p>
    </div>

    <!-- SIN CITAS -->
    <div
      v-else-if="appointments.noAppointments"
      class="text-center border border-white/5 rounded-xl bg-white/[0.02] px-5 py-10 sm:px-8 sm:py-16 min-h-[55vh] sm:min-h-[50vh] flex flex-col items-center justify-center"
    >
      <div
        class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/10 flex items-center justify-center mb-4"
      >
        <svg
          class="w-6 h-6 sm:w-7 sm:h-7 text-white/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <p class="text-white/70 text-sm sm:text-base font-barber">
        No tienes próximas citas
      </p>

      <p
        class="text-white/35 text-xs mt-2 max-w-[260px] mx-auto leading-relaxed"
      >
        Cuando reserves, aparecerán aquí con todos los detalles.
      </p>

      <RouterLink
        :to="{ name: 'BarberSelect' }"
        class="inline-block mt-6 px-6 py-3 bg-[#ffb700] text-black text-[10px] font-barber uppercase tracking-[0.2em] rounded hover:bg-[#e6a500] transition-colors duration-300"
      >
        Agendar nueva cita
      </RouterLink>
    </div>

    <!-- LISTA DE CITAS -->
    <div v-else class="grid grid-cols-1 gap-4 sm:gap-5">
      <Appointments
        v-for="appointment in appointments.appointments"
        :key="appointment._id"
        :appointment="appointment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import Appointments from "@/components/UI/Appointments.vue";
import { useMyAppointmentsStore } from "@/stores/myAppointments";

const appointments = useMyAppointmentsStore();

onMounted(() => {
  appointments.getMyAppointments();
});
</script>

<style scoped>
</style>