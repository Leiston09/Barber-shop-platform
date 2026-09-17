<template>
  <div>
    <!-- ENCABEZADO -->
    <div class="flex items-center justify-between mb-14">
      <div class="w-24 hidden sm:block"></div>

      <div class="text-center flex-1">
        <div class="flex items-center justify-center gap-4 mb-5">
          <span class="w-10 h-px bg-[#ffb700]" />

          <span
            class="text-[#ffb700] text-2xl uppercase tracking-[0.4em] font-medium"
          >
            Elige un barbero
          </span>

          <span class="w-10 h-px bg-[#ffb700]" />
        </div>

        <p class="text-white/40 text-sm font-light mt-4 max-w-md mx-auto">
          Selecciona un profesional para consultar sus horarios disponibles y
          reservar tu cita.
        </p>
      </div>
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

    <!-- LISTA DE BARBEROS -->
    <div
      v-else
      class="grid gap-6 lg:gap-8 max-w-5xl mx-auto"
      :class="{
        'grid-cols-1 max-w-md': barberStore.barbers.length === 1,
        'grid-cols-1 md:grid-cols-2 max-w-3xl': barberStore.barbers.length === 2,
        'grid-cols-1 md:grid-cols-3': barberStore.barbers.length === 3,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4':
          barberStore.barbers.length >= 4,
      }"
    >
      <button
        v-for="(barber, index) in barberStore.barbers"
        :key="barber._id"
        type="button"
        @click="selectBarber(barber)"
        class="group relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border transition-all duration-500 text-left"
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
          class="absolute top-5 right-5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300"
          :class="
            appointmentBooking.barber?._id === barber._id
              ? 'border-[#ffb700] bg-[#ffb700] text-black'
              : 'border-white/20 bg-black/30 text-transparent'
          "
        >
          ✓
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <p
            class="text-[#ffb700] text-[9px] uppercase tracking-[0.35em] font-medium mb-3"
          >
            0{{ index + 1 }} / Profesional
          </p>

          <h2
            class="font-barber text-2xl sm:text-3xl text-white font-light leading-tight"
          >
            {{ barber.name }}
          </h2>

          <p
            class="text-white/50 text-xs sm:text-sm font-light mt-2 line-clamp-2"
          >
            Profesional de The Barber Studio.
          </p>

          <div
            class="mt-5 flex items-center gap-3 text-white/70 text-xs uppercase tracking-[0.2em]"
          >
            <span>
              {{
                appointmentBooking.barber?._id === barber._id
                  ? "Seleccionado"
                  : "Seleccionar"
              }}
            </span>

            <span
              class="text-[#ffb700] text-base transition-transform duration-300"
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
      class="flex justify-end pt-6 mt-10 border-t border-white/5"
    >
      <RouterLink
        :to="{ name: 'New-appointments' }"
        class="px-8 py-4 bg-[#ffb700] text-black text-sm font-barber font-medium uppercase tracking-[0.15em] rounded-lg hover:bg-[#e6a500] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffb700]/20"
      >
        Continuar con servicios →
      </RouterLink>
    </div>

    <!-- PIE -->
    <p
      class="text-center text-white/20 text-[10px] uppercase tracking-[0.3em] mt-14"
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