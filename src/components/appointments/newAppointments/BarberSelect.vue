<template>
  <div class="pb-8">
    <!-- ENCABEZADO -->
    <header class="text-center mb-8 sm:mb-10">
      <h1
        class="font-barber text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight"
      >
        Elige tu <span class="text-[#ffb700]">barbero</span>
      </h1>

      <p class="text-white/50 text-sm mt-3 max-w-md mx-auto leading-relaxed">
        Selecciona quién te atenderá en tu próxima visita.
      </p>
    </header>

    <!-- CARGANDO -->
    <div
      v-if="barberStore.loading"
      class="flex flex-col items-center justify-center py-20"
    >
      <div
        class="w-9 h-9 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
      />
      <p class="text-white/40 text-xs mt-4">Cargando barberos...</p>
    </div>

    <!-- ERROR -->
    <div v-else-if="barberStore.error" class="text-center py-16">
      <p class="text-red-400/80 text-sm mb-4">
        {{ barberStore.error }}
      </p>

      <button
        type="button"
        @click="barberStore.getBarbers()"
        class="px-5 py-2.5 border border-white/10 rounded-lg text-white/70 text-xs hover:border-[#ffb700]/60 hover:text-white transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>

    <!-- SIN BARBEROS -->
    <div
      v-else-if="barberStore.barbers.length === 0"
      class="text-center py-16 px-6 border border-white/10 rounded-2xl bg-white/[0.02] max-w-lg mx-auto"
    >
      <div
        class="w-14 h-14 mx-auto rounded-full border border-white/10 flex items-center justify-center mb-4"
      >
        <svg
          class="w-6 h-6 text-white/30"
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

      <h2 class="text-white/80 font-barber text-lg">
        No hay barberos disponibles
      </h2>

      <p class="text-white/40 text-sm mt-2">Inténtalo nuevamente más tarde.</p>
    </div>

    <!-- LISTA DE BARBEROS -->
    <div
      v-else
      class="grid gap-4 sm:gap-5 max-w-5xl mx-auto"
      :class="{
        'grid-cols-1 max-w-sm': barberStore.barbers.length === 1,
        'grid-cols-1 sm:grid-cols-2 max-w-2xl':
          barberStore.barbers.length === 2,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3':
          barberStore.barbers.length >= 3,
      }"
    >
      <button
        v-for="(barber, index) in barberStore.barbers"
        :key="barber._id"
        type="button"
        :aria-pressed="appointmentBooking.barber?._id === barber._id"
        :aria-label="`Seleccionar a ${barber.name}`"
        @click="selectBarber(barber)"
        class="group relative h-[300px] sm:h-[340px] rounded-2xl overflow-hidden border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb700] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        :class="
          appointmentBooking.barber?._id === barber._id
            ? 'border-[#ffb700] ring-1 ring-[#ffb700]/30'
            : 'border-white/10 hover:border-white/30'
        "
      >
        <!-- IMAGEN -->
        <img
          :src="`/img/barbers/barber${index + 1}.jpg`"
          :alt="barber.name"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          :class="
            appointmentBooking.barber?._id === barber._id
              ? 'brightness-100'
              : 'brightness-[0.65] group-hover:brightness-75'
          "
        />

        <!-- DEGRADADO -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5"
        />

        <!-- SELECCIÓN -->
        <div
          class="absolute top-4 right-4 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300"
          :class="
            appointmentBooking.barber?._id === barber._id
              ? 'bg-[#ffb700] border-[#ffb700] text-black'
              : 'bg-black/40 border-white/40 text-transparent'
          "
        >
          <svg
            v-if="appointmentBooking.barber?._id === barber._id"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="m5 12 4 4L19 6"
            />
          </svg>
        </div>

        <!-- INFORMACIÓN -->
        <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <p
            class="text-[#ffb700] text-[9px] uppercase tracking-[0.2em] font-medium mb-2"
          >
            BARBERO
          </p>

          <h2 class="font-barber text-xl sm:text-2xl text-white leading-tight">
            {{ barber.name }}
          </h2>

          <div
            class="flex items-center justify-between mt-4 pt-3 border-t border-white/15"
          >
            <span
              class="text-xs font-medium"
              :class="
                appointmentBooking.barber?._id === barber._id
                  ? 'text-[#ffb700]'
                  : 'text-white/70'
              "
            >
              {{
                appointmentBooking.barber?._id === barber._id
                  ? "Barbero elegido"
                  : "Elegir barbero"
              }}
            </span>

            <span
              class="text-xs font-medium"
              :class="
                appointmentBooking.barber?._id === barber._id
                  ? 'text-[#ffb700]'
                  : 'text-white/40'
              "
            >
              {{ appointmentBooking.barber?._id === barber._id ? "✓" : "+" }}
            </span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
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
