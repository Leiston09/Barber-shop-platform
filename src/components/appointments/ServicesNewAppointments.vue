<template>
  <div class="grid xl:grid-cols-[1fr_320px] xl:gap-8">
    <!-- COLUMNA PRINCIPAL -->
    <div class="min-w-0">
      <Buttons />

      <!-- CONTENIDO DEL PASO -->
      <RouterView />
    </div>

    <!-- SIDEBAR DESKTOP -->
    <aside class="hidden xl:block">
      <BookingSummary class="sticky top-20" />
    </aside>

    <!-- BOTÓN FLOTANTE PARA AVANZAR: MÓVIL -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-4"
    >
      <button
        v-if="
          (route.name === 'BarberSelect' && appointmentBooking.barber) ||
          (route.name === 'New-appointments' &&
            appointmentBooking.barber &&
            appointmentBooking.services.length > 0) ||
          (route.name === 'New-Appointments-details' &&
            appointmentBooking.validateReservation)
        "
        type="button"
        @click="
          route.name === 'BarberSelect'
            ? router.push({ name: 'New-appointments' })
            : route.name === 'New-appointments'
              ? router.push({ name: 'New-Appointments-details' })
              : handleSave()
        "
        class="xl:hidden fixed bottom-24 right-4 z-40 max-w-[65vw] px-4 py-3 rounded-xl bg-[#0b0b0b] border border-[#ffb700]/40 text-[#ffb700] text-[10px] font-bold uppercase tracking-wider shadow-xl active:scale-95 transition-transform"
      >
        {{
          route.name === "BarberSelect"
            ? "Continuar con servicios"
            : route.name === "New-appointments"
              ? "Continuar con fecha y hora"
              : "Confirmar reservación"
        }}
      </button>
    </Transition>

    <!-- CÍRCULO AMARILLO SIEMPRE VISIBLE A LA IZQUIERDA -->
    <button
      type="button"
      class="xl:hidden fixed bottom-24 left-4 z-40 w-12 h-12 rounded-full bg-[#ffb700] text-black shadow-2xl shadow-[#ffb700]/25 flex items-center justify-center active:scale-95 transition-transform"
      @click="summaryOpen = true"
      aria-label="Ver resumen de la reserva"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    </button>

    <!-- DRAWER MÓVIL -->
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
              <p
                class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium"
              >
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
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter, RouterView } from "vue-router";
import { useToast } from "vue-toast-notification";
import AppointmentsAPI from "@/api/AppointmentsAPI";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import BookingSummary from "@/components/UI/BookingSummary.vue";
import Buttons from "./AppointmentSteps/Buttons.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const appointmentBooking = useAppointmentBookingStore();

const loadingAppointment = ref(false);
const summaryOpen = ref(false);

const { id } = route.params as { id?: string };

const handleSave = () => {
  appointmentBooking.saveAppointment(toast);
};

async function validateCurrentStep() {
  if (loadingAppointment.value) return;

  const hasBarber = !!appointmentBooking.barber;
  const hasServices = appointmentBooking.services.length > 0;

  if (
    (route.name === "New-appointments" ||
      route.name === "New-Appointments-details") &&
    !hasBarber
  ) {
    await router.replace({ name: "BarberSelect" });
    return;
  }

  if (route.name === "New-Appointments-details" && !hasServices) {
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