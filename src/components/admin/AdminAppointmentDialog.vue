<template>
  <EditAppointmentModal v-if="mode === 'edit' && appointment" :key="appointment._id" :visible="true" :appointment="appointment" @update:visible="value => { if (!value) emit('close'); }" @saved="emit('changed')" />
  <dialog ref="dialog" aria-labelledby="admin-appointment-title" :aria-busy="busy" :closedby="busy ? 'none' : 'closerequest'" @cancel.prevent="close" @keydown.esc.stop.prevent="close" @click.self="close" class="m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 p-0 text-white backdrop:bg-black/80 open:flex open:flex-col sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100%-3rem)]">
    <template v-if="appointment && mode && mode !== 'edit'">
      <header class="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-4 sm:px-6">
        <div class="min-w-0"><h2 id="admin-appointment-title" class="font-barber text-2xl">{{ mode === 'cancel' ? 'Cancelar cita' : 'Detalle de la reserva' }}</h2><p class="mt-2 break-words text-sm text-white/55">{{ appointment.user?.name || 'Cliente no disponible' }}</p></div>
        <button type="button" autofocus :disabled="busy" @click="close" aria-label="Cerrar" class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15 text-xl text-white/70 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#ffb700]">×</button>
      </header>
      <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6" :inert="busy">
        <p v-if="mode === 'cancel'" class="mb-5 text-sm leading-6 text-white/65">Se cancelará la reserva y su horario quedará libre. Esta acción no se puede deshacer.</p>
        <div class="flex items-center gap-3 rounded-xl border border-white/10 p-3"><BarberPortrait :id="appointment.barber?._id" :name="appointment.barber?.name || 'Profesional no disponible'" compact class="h-16! w-16 shrink-0 rounded-lg" /><div class="min-w-0"><p class="break-words text-sm">{{ appointment.barber?.name || 'Profesional no disponible' }}</p><p class="mt-1 text-xs leading-5 text-white/50">{{ agendaDateLabel(appointment.date) }}</p><p class="mt-1 text-sm text-[#ffb700]">{{ appointment.time }} · 60 minutos</p></div></div>
        <p class="mt-4 break-all text-xs text-white/50">{{ appointment.user?.email || 'Correo no disponible' }}</p>
        <ul class="mt-4 space-y-2 text-sm text-white/80"><li v-for="service in appointment.services.filter(Boolean)" :key="service._id">{{ service.name }}</li></ul>
        <div class="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4"><p class="text-xs text-white/50">Importe de la reserva</p><strong class="text-xl tabular-nums text-[#ffb700]">{{ formatCurrency(appointment.totalAmount) }}</strong></div>
        <template v-if="mode === 'detail'">
          <section class="mt-5 rounded-xl border border-white/10 p-4">
            <h3 class="text-sm font-medium">Resultado de la atención</h3><p class="mt-2 text-sm" :class="appointment.attendance === 'attended' ? 'text-green-400' : appointment.attendance === 'no_show' ? 'text-red-300' : 'text-white/55'">{{ attendanceLabel(appointment.attendance) }}</p>
            <p v-if="!finished" class="mt-2 text-xs leading-5 text-white/40">La asistencia se registra cuando termina el turno.</p>
            <button v-else-if="!correcting" type="button" @click="correcting = true" class="mt-3 min-h-10 text-xs text-[#ffb700]">{{ appointment.attendance === 'pending' ? 'Registrar asistencia' : 'Corregir asistencia' }}</button>
            <form v-if="correcting" class="mt-4 space-y-3" @submit.prevent="saveAttendance">
              <div role="group" aria-label="Resultado de asistencia" class="grid grid-cols-2 gap-2"><button v-for="option in attendanceOptions" :key="option.value" type="button" :aria-pressed="result === option.value" @click="result = option.value; confirming = false" class="min-h-11 rounded-lg border px-3 text-sm aria-pressed:border-[#ffb700] aria-pressed:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700]" :class="result === option.value ? 'border-[#ffb700]/50 bg-[#ffb700]/5' : 'border-white/15 text-white/65'">{{ option.label }}</button></div>
              <label class="block text-xs text-white/60">Motivo del registro o corrección<textarea v-model="reason" @input="confirming = false" maxlength="300" rows="2" required class="mt-2 w-full min-w-0 rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-white focus:border-[#ffb700] focus:outline-none" placeholder="Explica brevemente por qué se actualiza." /></label>
              <p class="text-xs leading-5 text-white/40">Se guardarán tu nombre, la fecha, el motivo y el resultado anterior. Los indicadores y las notificaciones del cliente se actualizarán según la asistencia.</p>
              <p v-if="confirming" role="status" class="rounded-lg border border-[#ffb700]/25 p-3 text-xs leading-5 text-[#ffb700]">Confirma el cambio a «{{ attendanceLabel(result) }}». El resultado quedará registrado.</p>
              <div class="flex flex-wrap gap-2"><button type="button" @click="correcting = false; confirming = false" class="min-h-11 rounded-lg border border-white/15 px-3 text-xs text-white/65">Volver</button><button type="submit" :disabled="!reason.trim() || !result || result === appointment.attendance || busy" class="min-h-11 rounded-lg bg-[#ffb700] px-4 text-xs font-semibold text-black disabled:opacity-40">{{ confirming ? 'Confirmar corrección' : 'Revisar cambio' }}</button></div>
            </form>
          </section>
          <details v-if="appointment.attendanceHistory?.length" class="mt-4 rounded-xl border border-white/10 p-4"><summary class="cursor-pointer text-xs text-white/65">Historial de correcciones ({{ appointment.attendanceHistory.length }})</summary><ol class="mt-4 space-y-4"><li v-for="(entry, index) in appointment.attendanceHistory" :key="index" class="text-xs leading-5"><p class="text-white/75">{{ entry.actorName }} · {{ new Date(entry.at).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' }) }}</p><p class="mt-1 text-white/50">{{ attendanceLabel(entry.previous) }} / {{ attendanceLabel(entry.result) }}</p><p class="mt-1 break-words text-white/65">{{ entry.reason }}</p></li></ol></details>
        </template>
        <p v-if="!editable" class="mt-4 text-xs leading-6 text-white/45">La reserva ya forma parte del historial. Su profesional, servicios, fecha e importe se conservan; puedes corregir su asistencia cuando termine el turno.</p>
        <p v-if="error" role="alert" class="mt-4 text-sm text-red-300">{{ error }}</p>
      </div>
      <footer class="flex shrink-0 flex-wrap justify-end gap-2 border-t border-white/10 p-4 sm:px-6">
        <button type="button" :disabled="busy" @click="close" class="min-h-11 rounded-lg border border-white/20 px-4 text-sm text-white/70">{{ mode === 'cancel' ? 'Volver' : 'Cerrar' }}</button>
        <button v-if="mode === 'detail' && editable" type="button" :disabled="busy" @click="emit('edit', appointment)" class="min-h-11 rounded-lg border border-[#ffb700]/35 px-4 text-sm text-[#ffb700]">Editar cita</button>
        <button v-if="mode === 'cancel' && editable" type="button" :disabled="busy" @click="cancelAppointment" class="min-h-11 rounded-lg bg-red-500 px-4 text-sm font-medium">{{ busy ? 'Cancelando…' : 'Confirmar cancelación' }}</button>
      </footer>
    </template>
  </dialog>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import EditAppointmentModal from "@/components/UI/EditAppointmentModal.vue";
import BarberPortrait from "@/components/UI/BarberPortrait.vue";
import { useAdminStore, type AdminAppointment } from "@/stores/admin";
import AdminAPI from "@/api/adminAPI";
import { useToast } from "@/lib/notifications";
import { agendaClock, agendaDateLabel, appointmentTiming, attendanceLabel } from "@/helpers/adminAgenda";
import { formatCurrency } from "@/helpers";
const props = defineProps<{ mode: "detail" | "edit" | "cancel" | null; appointment: AdminAppointment | null }>();
const emit = defineEmits<{ close: []; changed: []; edit: [appointment: AdminAppointment] }>();
const store = useAdminStore(), toast = useToast(), dialog = ref<HTMLDialogElement>(), busy = ref(false), error = ref("");
const correcting = ref(false), confirming = ref(false), reason = ref(""), result = ref("");
const clock = ref(Date.now()), now = computed(() => agendaClock(new Date(clock.value)));
const editable = computed(() => !!props.appointment && appointmentTiming(props.appointment, now.value) === "upcoming" && !["attended", "no_show"].includes(props.appointment.attendance || ""));
const finished = computed(() => !!props.appointment && appointmentTiming(props.appointment, now.value) === "past");
const attendanceOptions = [{ value: "attended", label: "Asistió" }, { value: "no_show", label: "No asistió" }];
function close() { if (!busy.value) { dialog.value?.close(); emit("close"); } }
watch(() => [props.mode, props.appointment?._id], async () => {
  error.value = ""; correcting.value = false; confirming.value = false; reason.value = ""; result.value = props.appointment?.attendance === "pending" ? "" : props.appointment?.attendance || "";
  dialog.value?.close();
  if (!props.mode || props.mode === "edit" || !props.appointment) return;
  await nextTick(); if (props.mode && !dialog.value?.open) dialog.value?.showModal();
}, { immediate: true });
async function cancelAppointment() {
  if (!props.appointment || !editable.value || busy.value) return;
  busy.value = true;
  const success = await store.deleteAppointment(props.appointment._id, toast);
  busy.value = false;
  if (success) { emit("changed"); close(); } else error.value = "No se pudo cancelar la reserva. Actualiza para revisar su estado.";
}
async function saveAttendance() {
  if (!props.appointment || !finished.value || !reason.value.trim() || !result.value || busy.value) return;
  if (!confirming.value) { confirming.value = true; return; }
  busy.value = true; error.value = "";
  try {
    const { data } = await AdminAPI.correctAttendance(props.appointment._id, { attendance: result.value, reason: reason.value.trim(), version: props.appointment.attendanceVersion ?? -1 });
    toast.success(data.msg); emit("changed"); busy.value = false; close();
  } catch (err: any) { error.value = err?.response?.data?.msg || "No pudimos guardar el resultado. Actualiza la cita para reintentarlo."; }
  finally { busy.value = false; }
}
let timer: ReturnType<typeof setInterval>;
onMounted(() => { timer = setInterval(() => { clock.value = Date.now(); }, 30000); });
onBeforeUnmount(() => { clearInterval(timer); dialog.value?.close(); });
</script>
