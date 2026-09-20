<template>
  <div>
    <!-- ENCABEZADO -->
    <div class="text-center mb-8 sm:mb-12">
      <div class="inline-flex items-center gap-3 mb-4 sm:mb-5">
        <span
          class="text-[#ffb700] text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium"
        >
          Paso 01
        </span>
        
      </div>

      <h1
        class="font-barber text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-[0.95]"
      >
        Elige un
        <span class="text-[#ffb700]"> barbero.</span>
      </h1>

      <p
        class="text-white/40 text-xs sm:text-sm font-light mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed"
      >
        Selecciona un profesional para consultar sus horarios disponibles y
        reservar tu cita.
      </p>
    </div>

    <!-- CARGANDO -->
    <div
      v-if="barberStore.loading"
      class="flex items-center justify-center py-20"
    >
      <div
        class="w-8 h-8 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
      />
    </div>

    <!-- ERROR -->
    <div v-else-if="barberStore.error" class="text-center py-20">
      <p class="text-white/40 text-sm font-light">{{ barberStore.error }}</p>
    </div>

    <!-- SIN BARBEROS -->
    <div
      v-else-if="barberStore.barbers.length === 0"
      class="text-center py-16 sm:py-20 border border-white/5 rounded-2xl bg-white/[0.02] px-6 max-w-lg mx-auto"
    >
      <div
        class="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full border border-white/10 flex items-center justify-center mb-4"
      >
        <svg
          class="w-6 h-6 sm:w-7 sm:h-7 text-white/20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>

      <p class="text-white/70 text-sm sm:text-base font-barber">
        No hay barberos disponibles
      </p>

      <p class="text-white/35 text-xs mt-2 max-w-[280px] mx-auto leading-relaxed">
        Por el momento no hay profesionales activos. Vuelve a intentarlo más tarde.
      </p>
    </div>

    <!-- LISTA DE BARBEROS -->
    <div
      v-else
      class="grid gap-4 sm:gap-5 lg:gap-6 max-w-5xl mx-auto"
      :class="{
        'grid-cols-1 max-w-sm': barberStore.barbers.length === 1,
        'grid-cols-1 sm:grid-cols-2 max-w-2xl': barberStore.barbers.length === 2,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3':
          barberStore.barbers.length === 3,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4':
          barberStore.barbers.length >= 4,
      }"
    >
      <button
        v-for="(barber, index) in barberStore.barbers"
        :key="barber._id"
        type="button"
        @click="selectBarber(barber)"
        class="group relative h-[320px] sm:h-[340px] lg:h-[360px] rounded-2xl overflow-hidden border transition-all duration-500 text-left"
        :class="
          appointmentBooking.barber?._id === barber._id
            ? 'border-[#ffb700] ring-1 ring-[#ffb700]/40'
            : 'border-white/10 hover:border-[#ffb700]/60'
        "
      >
        <img
          :src="`/img/barbers/barber${index + 1}.jpg`"
          :alt="barber.name"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          :class="
            appointmentBooking.barber?._id === barber._id
              ? 'brightness-100'
              : 'brightness-[0.5] group-hover:brightness-[0.65]'
          "
        />

        <div
          class="absolute inset-0 transition-all duration-500"
          :class="
            appointmentBooking.barber?._id === barber._id
              ? 'bg-gradient-to-t from-black/70 via-black/10 to-transparent'
              : 'bg-gradient-to-t from-black/95 via-black/50 to-transparent'
          "
        />

        <div
          class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700] to-transparent transition-opacity duration-500"
          :class="
            appointmentBooking.barber?._id === barber._id
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100'
          "
        />

        <div
          class="absolute top-4 right-4 sm:top-5 sm:right-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-300 text-xs sm:text-sm"
          :class="
            appointmentBooking.barber?._id === barber._id
              ? 'border-[#ffb700] bg-[#ffb700] text-black'
              : 'border-white/20 bg-black/30 text-transparent'
          "
        >
          ✓
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <p
            class="text-[#ffb700] text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-medium mb-2"
          >
            0{{ index + 1 }} / Profesional
          </p>

          <h2
            class="font-barber text-xl sm:text-2xl text-white font-light leading-tight"
          >
            {{ barber.name }}
          </h2>

          <p
            class="text-white/50 text-[11px] sm:text-xs font-light mt-1.5 line-clamp-2"
          >
            Profesional de The Barber Studio.
          </p>

          <div
            class="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 text-white/70 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em]"
          >
            <span>
              {{
                appointmentBooking.barber?._id === barber._id
                  ? "Seleccionado"
                  : "Seleccionar"
              }}
            </span>

            <span
              class="text-[#ffb700] text-sm sm:text-base transition-transform duration-300"
              :class="
                appointmentBooking.barber?._id === barber._id
                  ? 'translate-x-2'
                  : 'group-hover:translate-x-2'
              "
            >
              →
            </span>
          </div>
        </div>
      </button>
    </div>

    <!-- CONTINUAR -->
    <div
      v-if="appointmentBooking.barber"
      class="flex justify-center sm:justify-end pt-6 mt-8 sm:mt-10 border-t border-white/5"
    >
      <RouterLink
        :to="{ name: 'New-appointments' }"
        class="w-full sm:w-auto text-center px-6 sm:px-8 py-4 bg-[#ffb700] text-black text-xs sm:text-sm font-barber font-medium uppercase tracking-[0.15em] rounded-lg hover:bg-[#e6a500] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffb700]/20"
      >
        Continuar con servicios →
      </RouterLink>
    </div>

    <!-- PIE -->
    <p
      class="text-center text-white/20 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] mt-10 sm:mt-14"
    >
      The Barber Studio · Estilo · Precisión · Confianza
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import { useBarberStore, type Barber } from "@/stores/barber";

const appointmentBooking = useAppointmentBookingStore();
const barberStore = useBarberStore();

function selectBarber(barber: Barber) {
  appointmentBooking.barber = {
    _id: barber._id,
    name: barber.name,
    email: barber.email,
  };
}

onMounted(() => {
  barberStore.getBarbers();
});
</script>

<style scoped></style>