<template>
  <dialog ref="dialog" aria-labelledby="user-dialog-title" @cancel.prevent="requestClose" @click.self="requestClose" class="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#101010] p-0 text-white shadow-2xl backdrop:bg-black/80">
    <div class="flex max-h-[calc(92dvh-2px)] flex-col">
      <header class="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
        <div class="min-w-0"><p class="mb-1 text-xs text-white/45">Ficha de la cuenta</p><h2 id="user-dialog-title" class="break-words font-barber text-xl sm:text-2xl">{{ user.name }}</h2><p class="mt-1 break-all text-xs leading-5 text-white/50">{{ user.email }}</p></div>
        <button type="button" :disabled="busy" @click="requestClose" aria-label="Cerrar ficha de la cuenta" class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-xl text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-40">×</button>
      </header>
      <nav aria-label="Ficha de usuario" class="grid shrink-0 grid-cols-4 gap-1 border-b border-white/10 px-3 py-2 sm:px-5">
        <button v-for="item in [{ id: 'summary', label: 'Resumen' }, { id: 'bookings', label: 'Reservas' }, { id: 'role', label: 'Rol' }, { id: 'access', label: 'Acceso' }]" :key="item.id" type="button" :disabled="busy" :aria-current="tab === item.id ? 'page' : undefined" @click="tab = item.id; action = null; error = ''" class="min-h-11 rounded-lg px-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-[#ffb700] sm:text-sm" :class="tab === item.id ? 'bg-[#ffb700]/10 text-[#ffb700]' : 'text-white/50 hover:text-white'">{{ item.label }}</button>
      </nav>
      <div class="min-h-0 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
        <p v-if="error" role="alert" class="mb-4 rounded-lg border border-red-400/25 p-3 text-sm leading-6 text-red-200">{{ error }}</p>
        <template v-if="action">
          <h3 id="account-action-title" tabindex="-1" class="text-lg font-medium focus:outline-none">{{ action === "role" ? "Confirmar cambio de rol" : action === "block" ? "Bloquear el acceso" : action === "unblock" ? "Restablecer el acceso" : "Eliminar esta cuenta" }}</h3>
          <p class="mt-2 break-words text-sm leading-6 text-white/65">{{ user.name }} · {{ user.email }}</p>
          <fieldset :disabled="busy" class="mt-5 min-w-0 space-y-4 disabled:opacity-50">
            <template v-if="action === 'role'">
              <div class="rounded-xl border border-[#ffb700]/25 p-4"><p class="text-sm text-white/75">{{ roleLabel(user.role) }} → <span class="text-[#ffb700]">{{ roleLabel(selectedRole) }}</span></p><p class="mt-3 text-sm leading-6 text-white/55">Se cerrarán sus sesiones actuales. La cuenta necesitará iniciar sesión de nuevo para usar sus nuevos permisos.</p></div>
              <p v-if="selectedRole === 'barber'" class="text-sm leading-6 text-white/55">Después del cambio, configura su jornada y fotografía desde Barberos. Sin jornada habilitada no podrá recibir nuevas reservas.</p>
              <label v-if="selectedRole === 'admin'" class="flex items-start gap-3 rounded-lg border border-amber-400/25 p-4 text-sm leading-6 text-amber-200"><input v-model="grantAdmin" type="checkbox" class="mt-1 size-4 shrink-0 accent-[#ffb700]" />Entiendo que tendrá acceso completo a la administración y a los datos de los usuarios.</label>
            </template>
            <template v-else-if="action === 'block'">
              <p class="text-sm leading-6 text-white/65">La cuenta perderá el acceso y se cerrarán sus sesiones. Su historial de reservas se conservará.</p>
              <p v-if="user.role !== 'client'" class="rounded-lg border border-amber-400/25 p-4 text-sm leading-6 text-amber-200">Su rol cambiará de {{ roleLabel(user.role) }} a Cliente. Desbloquear la cuenta no restablecerá automáticamente su rol anterior.</p>
              <div class="rounded-lg border border-red-400/25 p-4"><p class="text-sm leading-6 text-red-200">{{ affected ? affected + (affected === 1 ? " cita futura se cancelará." : " citas futuras se cancelarán.") : "No tiene citas futuras pendientes de cancelación." }}</p><p class="mt-2 text-xs leading-5 text-white/50">Incluye sus reservas como cliente y sus turnos asignados como profesional, sin duplicarlos. Las citas ya comenzadas se conservan. Se intentará notificar por correo a las personas afectadas.</p></div>
            </template>
            <template v-else-if="action === 'unblock'">
              <p class="text-sm leading-6 text-white/65">La cuenta volverá a poder acceder si su correo está confirmado. Tendrá que iniciar sesión nuevamente.</p>
              <p class="rounded-lg border border-white/10 p-4 text-sm leading-6 text-white/55">Las reservas canceladas y los roles anteriores no se recuperan automáticamente.</p>
            </template>
            <template v-else>
              <p class="text-sm leading-6 text-white/65">Esta acción es permanente. Solo se permite eliminar cuentas sin reservas propias ni citas profesionales asociadas.</p>
              <label class="block text-xs leading-5 text-white/55">Escribe el correo de la cuenta para confirmar<input v-model="confirmation" type="email" autocomplete="off" spellcheck="false" class="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-red-400/30 bg-neutral-950 px-3 text-sm text-white focus:border-red-300 focus:outline-none" /></label>
            </template>
          </fieldset>
        </template>

        <section v-else-if="tab === 'summary'" aria-label="Resumen de la cuenta">
          <div class="flex flex-wrap gap-2 text-xs"><span class="rounded-md border border-white/15 px-3 py-2 text-white/75">{{ roleLabel(user.role) }}</span><span class="rounded-md border border-white/15 px-3 py-2" :class="user.blocked ? 'text-red-300' : user.verified ? 'text-green-400' : 'text-amber-300'">{{ statusLabel(user) }}</span><span v-if="user.protected" class="rounded-md border border-[#ffb700]/25 px-3 py-2 text-[#ffb700]">Administrador principal</span><span v-if="user._id === actorId" class="rounded-md border border-white/15 px-3 py-2 text-white/50">Tu cuenta</span></div>
          <dl class="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-white/10 p-4 sm:grid-cols-3"><div><dt class="text-xs text-white/45">Reservas registradas</dt><dd class="mt-2 text-xl tabular-nums">{{ user.appointmentsCount }}</dd></div><div><dt class="text-xs text-white/45">Próximas citas</dt><dd class="mt-2 text-xl tabular-nums text-[#ffb700]">{{ user.futureAppointmentsCount }}</dd></div><div class="col-span-2 sm:col-span-1"><dt class="text-xs text-white/45">Importe reservado</dt><dd class="mt-2 text-xl tabular-nums">{{ formatCurrency(user.totalSpent) }}</dd></div></dl>
          <p class="mt-2 text-xs leading-5 text-white/40">Actividad como cliente. Los importes corresponden a reservas registradas, no a pagos confirmados.</p>
          <dl class="mt-6 space-y-4 text-sm"><div class="flex flex-wrap justify-between gap-2"><dt class="text-white/45">Cuenta creada el</dt><dd class="text-white/75">{{ registrationDate(user.createdAt, false) }}</dd></div><div class="flex flex-wrap justify-between gap-2"><dt class="text-white/45">Correo</dt><dd :class="user.verified ? 'text-white/75' : 'text-amber-200'">{{ user.verified ? "Confirmado por el usuario" : "Pendiente de confirmación" }}</dd></div><div v-if="user.role === 'barber'" class="flex flex-wrap justify-between gap-2"><dt class="text-white/45">Próximos turnos como barbero</dt><dd class="text-white/75">{{ user.assignedFutureAppointmentsCount ?? 0 }}</dd></div></dl>
          <RouterLink v-if="user.assignedAppointmentsCount" :to="{ name: 'Admin-Appointments', query: { barber: user._id, view: 'upcoming' } }" class="mt-4 inline-flex min-h-11 items-center text-xs text-[#ffb700]">Ver su agenda como profesional</RouterLink>
          <div class="mt-6 rounded-xl border border-white/10 p-4"><h3 class="text-sm font-medium">Siguiente reserva como cliente</h3><p v-if="activityLoading" role="status" class="mt-3 text-sm text-white/45">Consultando reservas…</p><p v-else-if="activityError" class="mt-3 text-sm leading-6 text-amber-200">{{ activityError }}</p><div v-else-if="upcoming[0]" class="mt-3"><p class="text-sm text-[#ffb700]">{{ dateLabel(upcoming[0].date) }} · {{ upcoming[0].time }}</p><p class="mt-2 text-sm text-white/65">{{ upcoming[0].services.join(", ") || "Servicio no disponible" }}</p><p class="mt-1 text-xs text-white/45">{{ upcoming[0].barber }}</p></div><p v-else class="mt-3 text-sm text-white/45">No tiene próximas reservas.</p><button type="button" @click="tab = 'bookings'" class="mt-3 min-h-10 text-xs text-[#ffb700]">Consultar reservas</button></div>
        </section>

        <section v-else-if="tab === 'bookings'" aria-label="Reservas de la cuenta">
          <p v-if="activityLoading" role="status" class="py-8 text-center text-sm text-white/50">Consultando las reservas…</p>
          <div v-else-if="activityError" role="alert" class="mt-5 rounded-lg border border-amber-400/25 p-4"><p class="text-sm leading-6 text-amber-200">{{ activityError }}</p><button type="button" @click="loadActivity" class="mt-2 min-h-11 text-sm text-[#ffb700]">Volver a consultar</button></div>
          <template v-else>
            <h4 class="mb-2 mt-5 text-sm text-white/75">Hoy</h4><p v-if="!todayItems.length" class="text-xs text-white/45">Sin reservas para hoy.</p><article v-for="item in todayItems" :key="item._id" class="mb-2 rounded-lg border border-[#ffb700]/25 p-3"><p class="text-sm text-[#ffb700]">{{ item.time }} · {{ item.barber }}</p><p class="mt-2 text-xs text-white/65">{{ item.services.join(', ') }}</p></article>
<h4 class="mb-2 mt-5 text-sm text-white/75">Próximas citas</h4><p v-if="!upcoming.length" class="rounded-lg border border-white/10 p-4 text-sm text-white/45">Sin próximas citas.</p>
            <div v-for="item in upcoming.filter(item => appointmentDay(item.date) > now.date)" :key="item._id" class="mb-2 rounded-lg border border-[#ffb700]/20 p-4"><div class="flex flex-wrap items-center justify-between gap-2"><p class="text-sm text-[#ffb700]">{{ dateLabel(item.date) }} · {{ item.time }}</p><span class="text-xs text-white/70">{{ formatCurrency(item.total) }}</span></div><p class="mt-2 text-sm leading-5 text-white/75">{{ item.services.join(", ") || "Servicio no disponible" }}</p><p class="mt-1 text-xs leading-5 text-white/45">{{ item.barber }} · {{ timingLabel(item) }}</p></div>
            <p v-if="upcoming.length === 50" class="mt-2 text-xs leading-5 text-white/40">Se muestran hasta 50 próximas reservas.</p>
            <h4 class="mb-2 mt-6 text-sm text-white/75">Historial <span class="text-white/40">({{ historyTotal }})</span></h4><p v-if="!history.length" class="rounded-lg border border-white/10 p-4 text-sm text-white/45">Sin reservas anteriores.</p>
            <div v-for="item in history.filter(item => appointmentDay(item.date) < now.date)" :key="item._id" class="border-b border-white/10 py-3 last:border-b-0"><div class="flex flex-wrap items-center justify-between gap-2"><p class="text-xs text-white/65">{{ dateLabel(item.date) }} · {{ item.time }}</p><span class="text-xs text-white/55">{{ formatCurrency(item.total) }}</span></div><p class="mt-2 text-sm leading-5 text-white/75">{{ item.services.join(", ") || "Servicio no disponible" }}</p><p class="mt-1 text-xs leading-5 text-white/40">{{ item.barber }} · {{ timingLabel(item) }}</p></div>
            <div v-if="historyPages > 1" class="mt-4 flex items-center justify-between gap-3 text-xs text-white/60"><button type="button" :disabled="historyPage <= 1" @click="historyPage--" class="min-h-11 rounded-lg border border-white/15 px-3 disabled:opacity-30">Anterior</button><span>{{ historyPage }} de {{ historyPages }}</span><button type="button" :disabled="historyPage >= historyPages" @click="historyPage++" class="min-h-11 rounded-lg border border-white/15 px-3 disabled:opacity-30">Siguiente</button></div>
          </template>
        </section>

        <section v-else aria-label="Rol y acceso">
          <p v-if="!manageable" class="rounded-xl border border-[#ffb700]/25 p-4 text-sm leading-6 text-amber-200">{{ user.protected ? "La cuenta principal está protegida. No se pueden cambiar sus permisos, bloquearla ni eliminarla desde aquí." : "Estás viendo tu propia cuenta. Otro administrador debe gestionar tus permisos y acceso." }}</p>
          <template v-else>
            <div v-if="tab === 'role'">
            <h3 class="text-base font-medium">Permisos de la cuenta</h3><p class="mt-2 text-sm leading-6 text-white/50">Asigna únicamente el acceso que esta persona necesita.</p>
            <fieldset :disabled="busy" class="mt-4 space-y-2"><label v-for="option in roleOptions" :key="option.value" class="flex cursor-pointer items-start gap-3 rounded-xl border p-4" :class="selectedRole === option.value ? 'border-[#ffb700]/35 bg-[#ffb700]/5' : 'border-white/10'"><input v-model="selectedRole" type="radio" :value="option.value" name="account-role" class="mt-0.5 size-4 shrink-0 accent-[#ffb700]" /><span><span class="block text-sm" :class="selectedRole === option.value ? 'text-[#ffb700]' : 'text-white/75'">{{ option.label }}</span><span class="mt-1 block text-xs leading-5 text-white/45">{{ option.description }}</span></span></label></fieldset>
            <p v-if="roleBlocked" class="mt-3 text-xs leading-5 text-amber-200">{{ user.role === 'barber' && selectedRole !== 'barber' && (user.assignedFutureAppointmentsCount ?? 0) > 0 ? 'Reasigna las próximas citas de este barbero antes de cambiar su rol.' : 'Para recibir permisos de barbero o administrador debe confirmar su correo y tener la cuenta habilitada.' }}</p>
            <button type="button" :disabled="busy || selectedRole === user.role || roleBlocked" @click="beginAction('role')" class="mt-3 min-h-11 rounded-lg border border-[#ffb700]/35 px-4 text-sm text-[#ffb700] disabled:opacity-35">Revisar cambio de rol</button>
</div><div v-if="tab === 'access'">
            <div class="mt-6 border-t border-white/10 pt-5"><h3 class="text-base font-medium">Acceso al sitio</h3><p class="mt-2 text-sm leading-6 text-white/50">{{ user.blocked ? 'Esta cuenta está bloqueada. Puedes restablecer su acceso sin recuperar las reservas canceladas.' : 'Bloquear impide iniciar sesión y conserva el historial. Revisa las consecuencias antes de confirmar.' }}</p><button type="button" :disabled="busy" @click="beginAction(user.blocked ? 'unblock' : 'block')" class="mt-3 min-h-11 rounded-lg border px-4 text-sm" :class="user.blocked ? 'border-white/20 text-white/75' : 'border-red-400/30 text-red-300'">{{ user.blocked ? "Revisar desbloqueo" : "Revisar bloqueo" }}</button></div>
            <details class="mt-6 rounded-xl border border-white/10 p-4"><summary class="cursor-pointer text-sm text-white/55 focus-visible:outline-2 focus-visible:outline-[#ffb700]">Eliminación de la cuenta</summary><p class="mt-3 text-xs leading-6 text-white/45">{{ deletable ? 'Esta cuenta no tiene citas asociadas. Puedes eliminarla de forma permanente tras escribir su correo en la confirmación.' : 'No se puede eliminar porque tiene citas asociadas como cliente o profesional. Utiliza el bloqueo para conservar el historial y los resultados del salón.' }}</p><button type="button" :disabled="busy || !deletable" @click="beginAction('delete')" class="mt-3 min-h-11 rounded-lg border border-red-400/25 px-4 text-sm text-red-300 disabled:opacity-35">Revisar eliminación</button></details>
</div>
          </template>
          <p v-if="!user.verified" class="mt-5 text-xs leading-6 text-white/45">La confirmación del correo corresponde al titular mediante su enlace de verificación. No se activa manualmente desde Administración.</p>
        </section>
      </div>
      <footer class="shrink-0 border-t border-white/10 bg-[#101010] px-4 py-4 sm:px-6">
        <p v-if="busy" role="status" class="mb-3 text-xs text-white/50">Procesando el cambio. Espera un momento…</p>
        <div class="flex flex-wrap justify-end gap-2"><button type="button" :disabled="busy" @click="action ? (action = null, error = '') : requestClose()" class="min-h-11 flex-1 rounded-lg border border-white/15 px-4 text-sm text-white/65 disabled:opacity-40 sm:flex-none">{{ action ? "Volver sin aplicar" : "Cerrar" }}</button><button v-if="action" type="button" :disabled="!canConfirm" @click="confirmAction" class="min-h-11 flex-1 rounded-lg px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-35 sm:flex-none" :class="action === 'block' || action === 'delete' ? 'bg-red-500 text-white' : 'bg-[#ffb700] text-black'">{{ busy ? "Procesando…" : action === "role" ? "Confirmar rol" : action === "block" ? "Confirmar bloqueo" : action === "unblock" ? "Confirmar desbloqueo" : "Eliminar definitivamente" }}</button></div>
      </footer>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import type { AdminUser, AdminUserAppointment } from "@/stores/admin";
import AdminAPI from "@/api/adminAPI";
import { affectedReservations, canDeleteAccount, canManageAccount, registrationDate, roleLabel, statusLabel, type UserRole } from "@/helpers/adminUsers";
import { agendaClock, appointmentDay, appointmentTiming } from "@/helpers/adminAgenda";
import { formatCurrency } from "@/helpers";
const props = defineProps<{ user: AdminUser; actorId?: string }>();
const emit = defineEmits<{ close: []; changed: [message: string]; refresh: [] }>();
type Action = "role" | "block" | "unblock" | "delete" | null;
const dialog = ref<HTMLDialogElement>(), tab = ref("summary"), action = ref<Action>(null), busy = ref(false), error = ref("");
const selectedRole = ref<UserRole>(props.user.role), grantAdmin = ref(false), confirmation = ref("");
const upcoming = ref<AdminUserAppointment[]>([]), history = ref<AdminUserAppointment[]>([]);
const activityLoading = ref(true), activityError = ref(""), historyTotal = ref(0), historyPage = ref(1);
const tick = ref(Date.now()), now = computed(() => agendaClock(new Date(tick.value)));
const manageable = computed(() => canManageAccount(props.user, props.actorId));
const deletable = computed(() => canDeleteAccount(props.user, props.actorId));
const affected = computed(() => affectedReservations(props.user));
const roleBlocked = computed(() => selectedRole.value !== "client" && (!props.user.verified || props.user.blocked) ||
  props.user.role === "barber" && selectedRole.value !== "barber" && (props.user.assignedFutureAppointmentsCount ?? 0) > 0);
const canConfirm = computed(() => manageable.value && !busy.value &&
  (action.value !== "role" || selectedRole.value !== props.user.role && !roleBlocked.value && (selectedRole.value !== "admin" || grantAdmin.value)) &&
  (action.value !== "delete" || deletable.value && confirmation.value.trim().toLowerCase() === props.user.email.toLowerCase()));
const todayBookings = ref<AdminUserAppointment[]>([]);
const todayItems = computed(() => todayBookings.value);
const historyPages = computed(() => Math.max(1, Math.ceil(historyTotal.value / 10)));
const dateLabel = (value: string) => {
  const date = appointmentDay(value);
  return date ? new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date + "T12:00:00Z")) : "Fecha no disponible";
};
const timingLabel = (item: AdminUserAppointment) => ({ upcoming: "Próxima", current: "En horario", past: "Hora pasada", unknown: "Por revisar" })[appointmentTiming(item, now.value)];
const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: "client", label: "Cliente", description: "Reserva citas y gestiona sus reservas." },
  { value: "barber", label: "Barbero", description: "Gestiona su disponibilidad y sus citas asignadas." },
  { value: "admin", label: "Administrador", description: "Administra cuentas, citas, equipo y servicios." },
];
let controller: AbortController | undefined, sequence = 0, alive = true, timer: ReturnType<typeof setInterval> | undefined;
function validAppointments(items: unknown): items is AdminUserAppointment[] {
  return Array.isArray(items) && items.every(item => item && typeof item._id === "string" && appointmentDay(item.date) &&
    typeof item.time === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(item.time) && Array.isArray(item.services) &&
    item.services.every((service: any) => typeof service === "string") && typeof item.barber === "string" && Number.isFinite(item.total));
}
async function loadActivity() {
  const version = ++sequence; controller?.abort(); controller = new AbortController();
  activityLoading.value = true; activityError.value = "";
  try {
    const { data } = await AdminAPI.getUserActivity(props.user._id, historyPage.value, controller.signal);
    if (!alive || version !== sequence) return;
    if (!validAppointments(data?.upcoming) || !validAppointments(data?.history) || !Number.isInteger(data.historyTotal) || data.historyTotal < 0 || data.page !== historyPage.value || data.pageSize !== 10) throw new Error("Respuesta no válida");
    todayBookings.value = Array.isArray(data.today) ? data.today : [...data.upcoming, ...data.history].filter((item: AdminUserAppointment) => appointmentDay(item.date) === now.value.date);
    upcoming.value = data.upcoming; history.value = data.history; historyTotal.value = data.historyTotal;
  } catch (err: any) {
    if (!alive || version !== sequence) return;
    upcoming.value = []; history.value = [];
    activityError.value = err?.response?.data?.msg || "No pudimos consultar las reservas de esta cuenta.";
  } finally { if (alive && version === sequence) activityLoading.value = false; }
}
function requestClose() { if (!busy.value) emit("close"); }
function beginAction(value: Action) { if (busy.value || !manageable.value) return; action.value = value; error.value = ""; grantAdmin.value = false; confirmation.value = ""; void nextTick(() => dialog.value?.querySelector<HTMLElement>("#account-action-title")?.focus()); }
async function confirmAction() {
  if (!canConfirm.value || !action.value) return;
  busy.value = true; error.value = "";
  try {
    const id = props.user._id;
    const result = action.value === "role" ? await AdminAPI.updateUserRole(id, selectedRole.value)
      : action.value === "delete" ? await AdminAPI.deleteUser(id)
      : await AdminAPI.updateUserBlockStatus(id, action.value === "block", action.value === "block" ? affected.value : undefined);
    busy.value = false; emit("changed", result.data.msg || "Cuenta actualizada.");
  } catch (err: any) {
    error.value = err?.response?.data?.msg || "No pudimos completar la operación. Actualiza la ficha antes de reintentar.";
    if (err?.response?.status === 409 || err?.response?.status >= 500) {
      emit("refresh"); action.value = null; tab.value = "access";
    }
    grantAdmin.value = false; confirmation.value = "";
  } finally { busy.value = false; }
}
watch(historyPage, () => { void loadActivity(); });
onBeforeRouteLeave(() => !busy.value);
onMounted(async () => { await nextTick(); dialog.value?.showModal(); void loadActivity(); timer = setInterval(() => { tick.value = Date.now(); }, 30000); });
onBeforeUnmount(() => { alive = false; sequence++; controller?.abort(); if (timer) clearInterval(timer); dialog.value?.close(); });
</script>
