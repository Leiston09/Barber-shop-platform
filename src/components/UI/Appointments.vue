<!-- src/components/UI/Appointments.vue -->

<template>
  <div
    class="relative bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-[#ffb700]/30 transition-all duration-300 group overflow-hidden"
  >
    <!-- LÍNEA SUPERIOR (hover) -->
    <div
      class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    />

    <!-- BARRA LATERAL DE ESTADO -->
    <span
      :class="[
        'absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full',
        statusColor,
      ]"
    />

    <!-- CONTENIDO -->
    <div class="pl-3">
      <!-- FECHA + HORA + CHIP -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/5"
      >
        <div class="flex items-center gap-4">
          <!-- FECHA TIPO CALENDARIO -->
          <div
            class="shrink-0 w-14 rounded-xl border border-[#ffb700]/25 bg-[#ffb700]/5 flex flex-col items-center justify-center py-2"
          >
            <span class="font-barber text-2xl text-[#ffb700] leading-none">
              {{ dateParts.day }}
            </span>
            <span
              class="text-[9px] uppercase tracking-[0.2em] text-[#ffb700]/70 mt-1"
            >
              {{ dateParts.month }}
            </span>
            <span
              class="text-[8px] uppercase tracking-[0.15em] text-white/30 mt-0.5"
            >
              {{ dateParts.weekday }}
            </span>
          </div>

          <!-- HORA -->
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium mb-1"
            >
              Hora
            </p>
            <p class="font-barber text-xl text-white leading-none">
              {{ appointment.time }}
            </p>
            <p class="text-white/30 text-[10px] mt-1.5">
              {{ displayDate(appointment.date) }}
            </p>
          </div>
        </div>

        <!-- CHIP DE ESTADO -->
        <span
          :class="[
            'self-start sm:self-auto text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border',
            statusChipClass,
          ]"
        >
          {{ statusLabel }}
        </span>
      </div>

      <!-- BARBERO + SERVICIOS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-5 border-b border-white/5">
        <!-- BARBERO -->
        <div v-if="appointment.barber">
          <p
            class="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium mb-3"
          >
            Barbero
          </p>

          <div class="flex items-center gap-3">
            <img
              :src="`/img/barbers/barber${barberIndex + 1}.jpg`"
              :alt="appointment.barber.name"
              class="w-11 h-11 rounded-full object-cover border border-[#ffb700]/30"
            />

            <div class="min-w-0">
              <p class="text-white/85 text-sm font-barber truncate">
                {{ appointment.barber.name }}
              </p>
              <p
                v-if="appointment.barber.email"
                class="text-white/30 text-[11px] truncate mt-0.5"
              >
                {{ appointment.barber.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- SERVICIOS -->
        <div>
          <p
            class="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium mb-3"
          >
            Servicios ({{ appointment.services?.length || 0 }})
          </p>

          <div
            v-if="appointment.services && appointment.services.length > 0"
            class="space-y-1.5"
          >
            <div
              v-for="(service, i) in appointment.services"
              :key="service._id"
              class="flex items-center justify-between gap-3 text-xs"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span
                  class="text-[9px] text-white/20 font-barber shrink-0 w-4"
                >
                  {{ String(i + 1).padStart(2, "0") }}
                </span>
                <span class="text-white/70 truncate">{{ service.name }}</span>
              </div>
              <span class="text-white/45 shrink-0 font-barber">
                {{ formatCurrency(service.price) }}
              </span>
            </div>
          </div>

          <p v-else class="text-white/30 text-xs italic">
            No hay servicios en esta cita
          </p>
        </div>
      </div>

      <!-- TOTAL -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-5 border-b border-white/5"
      >
        <p class="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium">
          Total a pagar
        </p>

        <p class="font-barber text-2xl sm:text-3xl text-[#ffb700] font-medium">
          {{ formatCurrency(appointment.totalAmount) }}
        </p>
      </div>

      <!-- ACCIONES -->
      <div class="pt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          @click="openEdit"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[10px] font-barber uppercase tracking-[0.2em] border border-[#ffb700]/30 text-[#ffb700]/90 hover:text-black hover:bg-[#ffb700] hover:border-[#ffb700] transition-all duration-300 rounded-lg"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Reprogramar
        </button>

        <button
          type="button"
          @click="openCancelWarning"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[10px] font-barber uppercase tracking-[0.2em] text-red-400/70 hover:text-red-300 transition-all duration-300 rounded-lg"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancelar reserva
        </button>
      </div>
    </div>

    <!-- MODAL DE CANCELACIÓN -->
    <AuthWarning
      v-model:visible="showWarning"
      title="¿Cancelar esta cita?"
      message="Estás a punto de cancelar tu reservación. Esta acción liberará el horario seleccionado para que otro cliente pueda reservarlo."
      :steps="[
        'Verifica que esta sea la cita que deseas cancelar.',
        'La fecha y hora quedarán disponibles nuevamente.',
      ]"
      :buttons="['Regresar', 'Confirmar cancelación']"
      @button-click="handleWarningButton"
    />

    <!-- MODAL DE EDICIÓN -->
    <EditAppointmentModal
      v-model:visible="editOpen"
      :appointment="appointment"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { formatCurrency } from "@/helpers";
import { displayDate } from "@/helpers/date";
import { useMyAppointmentsStore } from "@/stores/myAppointments";
import { useBarberStore } from "@/stores/barber";
import { useToast } from "vue-toast-notification";
import AuthWarning from "@/components/UI/AuthWarning.vue";
import EditAppointmentModal from "@/components/UI/EditAppointmentModal.vue";

interface Service {
  _id: string;
  name: string;
  price: number;
}

interface Barber {
  _id: string;
  name: string;
  email: string;
}

interface Appointment {
  _id: string;
  date: string;
  services: Service[];
  time: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  barber: Barber | null;
  totalAmount: number;
}

const props = defineProps<{
  appointment: Appointment;
}>();

const myAppointmentsStore = useMyAppointmentsStore();
const barberStore = useBarberStore();
const toast = useToast();

const showWarning = ref(false);
const editOpen = ref(false);

/* =========================================================
   ÍNDICE DE LA FOTO DEL BARBERO
   ========================================================= */
const barberIndex = computed(() => {
  if (!props.appointment.barber) return 0;
  const i = barberStore.barbers.findIndex(
    (b) => b._id === props.appointment.barber?._id,
  );
  return i >= 0 ? i : 0;
});

/* =========================================================
   FECHA → PARTES
   ========================================================= */
const dateParts = computed(() => {
  const MESES = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];
  const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const d = new Date(props.appointment.date);

  if (Number.isNaN(d.getTime())) {
    return { day: "—", month: "—", weekday: "—" };
  }

  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: MESES[d.getMonth()] ?? "—",
    weekday: DIAS[d.getDay()] ?? "—",
  };
});

/* =========================================================
   ESTADO: Hoy, Mañana, Próxima, Pasada
   ========================================================= */
const dayStatus = computed<"hoy" | "manana" | "proxima" | "pasada">(() => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const target = new Date(props.appointment.date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return "pasada";
  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "manana";
  return "proxima";
});

const daysFromNow = computed(() => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(props.appointment.date);
  target.setHours(0, 0, 0, 0);
  return Math.round(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
});

const statusLabel = computed(() => {
  switch (dayStatus.value) {
    case "hoy":
      return "Hoy";
    case "manana":
      return "Mañana";
    case "pasada":
      return "Pasada";
    default:
      if (daysFromNow.value <= 7) return `En ${daysFromNow.value} días`;
      if (daysFromNow.value <= 14) return "En 2 semanas";
      return "Próxima";
  }
});

const statusColor = computed(() => {
  switch (dayStatus.value) {
    case "hoy":
      return "bg-[#ffb700]";
    case "manana":
      return "bg-[#ffb700]/60";
    case "pasada":
      return "bg-red-500/50";
    default:
      return "bg-white/10";
  }
});

const statusChipClass = computed(() => {
  switch (dayStatus.value) {
    case "hoy":
      return "bg-[#ffb700]/10 border-[#ffb700]/40 text-[#ffb700]";
    case "manana":
      return "bg-[#ffb700]/5 border-[#ffb700]/25 text-[#ffb700]/80";
    case "pasada":
      return "bg-red-500/5 border-red-500/20 text-red-400/70";
    default:
      return "bg-white/5 border-white/10 text-white/45";
  }
});

/* =========================================================
   ACCIONES
   ========================================================= */
const openEdit = () => {
  editOpen.value = true;
};

const openCancelWarning = () => {
  showWarning.value = true;
};

const cancelAppointment = async () => {
  await myAppointmentsStore.cancelAppointment(
    props.appointment._id,
    toast,
  );
};

const handleWarningButton = (index: number) => {
  if (index === 0) {
    showWarning.value = false;
    return;
  }

  if (index === 1) {
    showWarning.value = false;
    cancelAppointment();
  }
};

const handleSaved = async () => {
  // Recargar lista de citas
  await myAppointmentsStore.getMyAppointments();
};
</script>

<style scoped></style>