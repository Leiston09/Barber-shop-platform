<template>
  <div class="grid xl:grid-cols-[1fr_320px] xl:gap-8">
    <!-- COLUMNA PRINCIPAL -->
    <div class="min-w-0">
      <!-- NAV DE PASOS -->
      <nav
        class="flex items-center gap-1 p-1 sm:gap-1.5 sm:p-1.5 mb-6 sm:mb-10 bg-white/[0.025] border border-white/5 rounded-xl overflow-x-auto scrollbar-hide"
      >
        <!-- BARBERO -->
        <RouterLink
          :to="{ name: 'BarberSelect' }"
          class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg transition-all duration-500 ease-out whitespace-nowrap shrink-0"
          :class="
            route.name === 'BarberSelect'
              ? 'flex-[1.8] bg-[#ffb700] text-black shadow-[0_0_25px_rgba(255,183,0,0.08)]'
              : 'flex-1 text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
          "
        >
          <span
            class="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500"
            :class="
              route.name === 'BarberSelect'
                ? 'bg-black scale-110'
                : 'bg-white/20'
            "
          />
          <span>Barbero</span>
        </RouterLink>

        <!-- SERVICIOS -->
        <RouterLink
          v-if="canAccessServices"
          :to="{ name: 'New-appointments' }"
          class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg transition-all duration-500 ease-out whitespace-nowrap shrink-0"
          :class="
            route.name === 'New-appointments'
              ? 'flex-[1.8] bg-[#ffb700] text-black shadow-[0_0_25px_rgba(255,183,0,0.08)]'
              : 'flex-1 text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
          "
        >
          <span
            class="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500"
            :class="
              route.name === 'New-appointments'
                ? 'bg-black scale-110'
                : 'bg-white/20'
            "
          />
          <span>Servicios</span>
        </RouterLink>

        <button
          v-else
          type="button"
          disabled
          class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg text-white/15 cursor-not-allowed whitespace-nowrap shrink-0"
        >
          <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-white/10" />
          <span>Servicios</span>
        </button>

        <!-- DETALLES -->
        <RouterLink
          v-if="canAccessDetails"
          :to="{ name: 'New-Appointments-details' }"
          class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg transition-all duration-500 ease-out whitespace-nowrap shrink-0"
          :class="
            route.name === 'New-Appointments-details'
              ? 'flex-[1.8] bg-[#ffb700] text-black shadow-[0_0_25px_rgba(255,183,0,0.08)]'
              : 'flex-1 text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
          "
        >
          <span
            class="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500"
            :class="
              route.name === 'New-Appointments-details'
                ? 'bg-black scale-110'
                : 'bg-white/20'
            "
          />
          <span>Detalles</span>
        </RouterLink>

        <button
          v-else
          type="button"
          disabled
          class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2 sm:px-4 text-[8px] sm:text-[9px] font-barber uppercase tracking-[0.12em] sm:tracking-[0.22em] rounded-lg text-white/15 cursor-not-allowed whitespace-nowrap shrink-0"
        >
          <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-white/10" />
          <span>Detalles</span>
        </button>
      </nav>

      <!-- CONTENIDO DEL PASO -->
      <RouterView />
    </div>

    <!-- SIDEBAR (desktop xl+) -->
    <aside class="hidden xl:block">
      <BookingSummary class="sticky top-20" />
    </aside>

    <!-- MOBILE: BOTÓN FLOTANTE (arriba del bottom nav) -->
    <button
      type="button"
      class="xl:hidden fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-[#ffb700] text-black shadow-2xl shadow-[#ffb700]/25 flex items-center justify-center active:scale-95 transition-transform"
      @click="summaryOpen = true"
      aria-label="Ver resumen de la reserva"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    </button>

    <!-- MOBILE: DRAWER (bottom sheet) -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="summaryOpen"
        class="xl:hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end"
        @click.self="summaryOpen = false"
      >
        <Transition
          appear
          enter-active-class="transition-transform duration-300"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
        >
          <div
            class="w-full bg-[#0b0b0b] border-t border-white/10 rounded-t-3xl px-5 pt-4 pb-8 max-h-[85vh] overflow-y-auto"
          >
            <div class="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div class="flex justify-between items-center mb-4">
              <p class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium">
                Resumen
              </p>

              <button
                type="button"
                @click="summaryOpen = false"
                class="text-white/40 hover:text-white text-lg leading-none"
                aria-label="Cerrar resumen"
              >
                ✕
              </button>
            </div>

            <BookingSummary />
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router";
import AppointmentsAPI from "@/api/AppointmentsAPI";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import BookingSummary from "@/components/UI/BookingSummary.vue";

const route = useRoute();
const router = useRouter();

const appointmentBooking = useAppointmentBookingStore();

const loadingAppointment = ref(false);
const summaryOpen = ref(false);

const { id } = route.params as { id?: string };

const hasBarber = computed(() => !!appointmentBooking.barber);
const hasServices = computed(() => appointmentBooking.services.length > 0);

const canAccessServices = computed(() => hasBarber.value);
const canAccessDetails = computed(() => hasBarber.value && hasServices.value);

async function validateCurrentStep() {
  if (loadingAppointment.value) return;

  if (route.name === "New-appointments" && !hasBarber.value) {
    await router.replace({ name: "BarberSelect" });
    return;
  }

  if (route.name === "New-Appointments-details" && !hasBarber.value) {
    await router.replace({ name: "BarberSelect" });
    return;
  }

  if (
    route.name === "New-Appointments-details" &&
    hasBarber.value &&
    !hasServices.value
  ) {
    await router.replace({ name: "New-appointments" });
  }
}

watch(
  () => route.name,
  () => {
    summaryOpen.value = false;
  },
);

watch(
  [
    () => route.name,
    () => appointmentBooking.barber,
    () => appointmentBooking.services.length,
  ],
  async () => {
    await validateCurrentStep();
  },
);

onMounted(async () => {
  if (!id) {
    await validateCurrentStep();
    return;
  }

  loadingAppointment.value = true;

  try {
    const { data } = await AppointmentsAPI.getById(id);
    appointmentBooking.setSelectedAppointment(data);
  } catch (error) {
    console.error("Error al cargar cita:", error);
    router.push({ name: "My-appointments" });
  } finally {
    loadingAppointment.value = false;
    await validateCurrentStep();
  }
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>