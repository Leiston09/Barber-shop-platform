<template>
  <article :aria-labelledby="'appointment-time-' + appointment._id" :aria-busy="cancelling"
    class="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-neutral-900/60"
    :class="dayStatus === 'hoy' ? 'border-[#ffb700]/30' : 'border-white/10'">
    <div class="flex-1 p-4 sm:p-5">
      <header class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3 sm:gap-4">
          <div aria-hidden="true" class="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-neutral-950">
            <span class="font-barber text-2xl leading-none text-white">{{ dateParts.day }}</span>
            <span class="mt-1 text-xs text-[#ffb700]">{{ dateParts.month }}</span>
          </div>
          <div class="min-w-0">
            <h3 :id="'appointment-time-' + appointment._id" class="text-xl font-semibold leading-tight tabular-nums text-white">{{ appointment.time }}</h3>
            <p class="mt-1 text-sm capitalize text-white/70">{{ dateParts.weekday }}</p>
            <time :datetime="dateKey" class="mt-1 block text-xs leading-5 text-white/45">{{ fullDate }}</time>
          </div>
        </div>
        <span class="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:text-xs" :class="statusChipClass">{{ statusLabel }}</span>
      </header>

      <div class="mt-5 flex min-w-0 items-center gap-3">
        <span aria-hidden="true" class="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/65">{{ barberInitials }}</span>
        <div class="min-w-0">
          <p class="text-xs text-white/45">Tu barbero</p>
          <p class="mt-1 break-words text-sm font-medium leading-5 text-white/90">{{ appointment.barber?.name || "Barbero no disponible" }}</p>
        </div>
      </div>

      <section :aria-labelledby="'appointment-services-' + appointment._id" class="mt-5">
        <h4 :id="'appointment-services-' + appointment._id" class="mb-2 text-xs font-medium text-white/50">Servicios</h4>
        <ul v-if="services.length" class="space-y-2">
          <li v-for="service in services" :key="service._id" class="flex items-start justify-between gap-4 text-sm leading-5">
            <span class="min-w-0 break-words text-white/80">{{ service.name }}</span>
            <span class="shrink-0 tabular-nums text-white/60">{{ formatCurrency(service.price) }}</span>
          </li>
        </ul>
        <p v-else class="text-sm text-white/50">Los servicios de esta cita no están disponibles.</p>
      </section>
    </div>

    <footer class="border-t border-white/10 bg-black/15 p-4 sm:p-5">
      <div class="mb-4 flex items-center justify-between gap-4">
        <p class="text-xs text-white/50">Total de tu cita</p>
        <p class="text-xl font-semibold tabular-nums text-[#ffb700]">{{ formatCurrency(appointment.totalAmount) }}</p>
      </div>
      <div class="grid grid-cols-2 gap-2 sm:gap-3">
        <button type="button" :disabled="cancelling" @click="openEdit"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#ffb700]/35 px-2 text-xs font-medium text-[#ffb700] transition-colors hover:bg-[#ffb700]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] disabled:cursor-wait disabled:opacity-50 motion-reduce:transition-none sm:text-sm">
          <svg aria-hidden="true" class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6M16 3l5 5-9 9H7v-5l9-9Z" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Reprogramar
        </button>
        <button type="button" :disabled="cancelling" @click="openCancelWarning"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-2 text-xs font-medium text-white/65 transition-colors hover:border-red-400/35 hover:bg-red-400/5 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-wait disabled:opacity-50 motion-reduce:transition-none sm:text-sm">
          <svg aria-hidden="true" class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m6 6 12 12M6 18 18 6" stroke-linecap="round" /></svg>
          {{ cancelling ? "Cancelando…" : "Cancelar cita" }}
        </button>
      </div>
    </footer>

    <CancelAppointmentDialog v-if="showWarning" :appointment="appointment" :busy="cancelling" :error="cancellationError" @close="showWarning = false" @confirm="confirmCancellation" />
    <EditAppointmentModal v-model:visible="editOpen" :appointment="appointment" @saved="handleSaved" />
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { formatCurrency } from "@/helpers";
import { useMyAppointmentsStore, type MyAppointment } from "@/stores/myAppointments";
import { useToast } from "@/lib/notifications";
import CancelAppointmentDialog from "@/components/UI/CancelAppointmentDialog.vue";
import EditAppointmentModal from "@/components/UI/EditAppointmentModal.vue";

const props = defineProps<{ appointment: MyAppointment }>();
const myAppointmentsStore = useMyAppointmentsStore();
const toast = useToast();
const showWarning = ref(false);
const cancellationError = ref("");
const editOpen = ref(false);
const cancelling = ref(false);
const services = computed(() => (props.appointment.services ?? []).filter(Boolean));
const barberInitials = computed(() => {
  const name = props.appointment.barber?.name?.trim();
  return name ? name.split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join("").toUpperCase() : "—";
});

// Mongo stores a business calendar day at UTC midnight; do not shift it to the visitor's timezone.
const dateKey = computed(() => props.appointment.date.slice(0, 10));
const calendarDate = computed(() => new Date(dateKey.value + "T12:00:00Z"));
const validDate = computed(() => !Number.isNaN(calendarDate.value.getTime()));
const dateParts = computed(() => validDate.value ? {
  day: String(calendarDate.value.getUTCDate()).padStart(2, "0"),
  month: new Intl.DateTimeFormat("es-EC", { month: "short", timeZone: "UTC" }).format(calendarDate.value).replace(".", ""),
  weekday: new Intl.DateTimeFormat("es-EC", { weekday: "long", timeZone: "UTC" }).format(calendarDate.value),
} : { day: "—", month: "—", weekday: "Fecha por confirmar" });
const fullDate = computed(() => validDate.value
  ? new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(calendarDate.value)
  : "Fecha no disponible");
const daysFromNow = computed(() => {
  if (!validDate.value) return null;
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Guayaquil" }).format(new Date());
  return Math.round((Date.parse(dateKey.value + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / 86400000);
});
const dayStatus = computed(() => daysFromNow.value === null ? "desconocida"
  : daysFromNow.value < 0 ? "pasada" : daysFromNow.value === 0 ? "hoy" : daysFromNow.value === 1 ? "manana" : "proxima");
const statusLabel = computed(() => {
  if (dayStatus.value === "desconocida") return "Por confirmar";
  if (dayStatus.value === "hoy") return "Hoy";
  if (dayStatus.value === "manana") return "Mañana";
  if (dayStatus.value === "pasada") return "Pasada";
  return daysFromNow.value! <= 7 ? `En ${daysFromNow.value} días` : "Próxima";
});
const statusChipClass = computed(() => {
  if (dayStatus.value === "hoy") return "border-[#ffb700]/30 bg-[#ffb700]/10 text-[#ffb700]";
  if (dayStatus.value === "manana") return "border-white/15 bg-white/5 text-white/80";
  return "border-white/10 text-white/55";
});

function openEdit() { if (!cancelling.value) editOpen.value = true; }
function openCancelWarning() { if (!cancelling.value) { toast.clear(); cancellationError.value = ""; showWarning.value = true; } }
async function confirmCancellation() {
  if (cancelling.value) return;
  cancelling.value = true; cancellationError.value = "";
  try {
    if (await myAppointmentsStore.cancelAppointment(props.appointment._id, toast)) showWarning.value = false;
    else cancellationError.value = "La cita sigue en tu agenda. No pudimos cancelarla; puedes volver a intentarlo.";
  } finally { cancelling.value = false; }
}
async function handleSaved() { await myAppointmentsStore.getMyAppointments(); }
</script>
