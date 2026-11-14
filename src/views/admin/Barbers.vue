<template>
  <div class="min-w-0 text-white">
    <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <h1 class="font-barber text-2xl tracking-tight sm:text-3xl">Equipo de barberos</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-white/55">Organiza las jornadas, las ausencias y el perfil de cada profesional.</p>
      </div>
      <button type="button" :disabled="loading" @click="refresh" class="min-h-11 rounded-lg border border-white/15 px-4 text-xs text-white/70 hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-40">{{ loading ? "Actualizando…" : "Actualizar" }}</button>
    </header>

    <div class="mb-6 grid grid-cols-2 gap-x-5 gap-y-4 rounded-2xl border border-white/10 bg-neutral-900/40 p-5 sm:grid-cols-4">
      <div v-for="stat in statistics" :key="stat.label"><p class="text-xs leading-5 text-white/50">{{ stat.label }}</p><p class="mt-1 font-barber text-2xl tabular-nums" :class="stat.accent ? 'text-[#ffb700]' : 'text-white'">{{ stat.value }}</p></div>
    </div>
    <section aria-label="Buscar profesionales" class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div class="min-w-0 flex-1"><label for="barber-search" class="mb-2 block text-xs text-white/55">Buscar profesional</label><input id="barber-search" v-model="search" type="search" placeholder="Nombre o correo" class="min-h-11 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm placeholder:text-white/30 focus:border-[#ffb700] focus:outline-none" /></div>
      <div class="sm:w-56"><label for="barber-state" class="mb-2 block text-xs text-white/55">Jornada semanal</label><select id="barber-state" v-model="filter" class="min-h-11 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm focus:border-[#ffb700] focus:outline-none"><option value="all">Todos los profesionales</option><option value="working">Con jornada habilitada</option><option value="missing">Pendientes de configurar</option><option value="paused">Sin días habilitados</option><option value="error">Horario sin consultar</option></select></div>
    </section>
    <p v-if="appointmentsError" role="alert" class="mb-5 rounded-lg border border-amber-400/25 p-4 text-sm leading-6 text-amber-200">No pudimos consultar las citas. Los indicadores de reservas no están disponibles. <button type="button" class="underline underline-offset-4" @click="refresh">Reintentar</button></p>
    <div v-if="loading" role="status" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><span class="sr-only">Consultando el equipo y sus horarios</span><div v-for="n in 3" :key="n" aria-hidden="true" class="h-72 rounded-2xl border border-white/10 bg-white/5 motion-safe:animate-pulse" /></div>
    <div v-else-if="error" role="alert" class="rounded-2xl border border-amber-400/20 p-6"><h2 class="text-lg">No pudimos consultar el equipo</h2><p class="mt-2 text-sm text-white/55">{{ error }}</p><button type="button" @click="refresh" class="mt-4 min-h-11 text-sm text-[#ffb700]">Volver a consultar</button></div>
    <template v-else>
      <div v-if="!barbers.length" class="rounded-2xl border border-white/10 p-7 text-center"><h2 class="font-barber text-xl">El equipo aún está por formar</h2><p class="mx-auto mt-2 max-w-md text-sm leading-6 text-white/55">Asigna el rol de barbero a un usuario con su correo confirmado. Después podrás configurar su jornada aquí.</p><RouterLink :to="{ name: 'Admin-Customer' }" class="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#ffb700] px-4 text-sm font-medium text-black">Ir a usuarios</RouterLink></div>
      <div v-else-if="!filtered.length" class="rounded-2xl border border-white/10 p-7 text-center"><p class="text-sm text-white/60">No hay profesionales con esta selección.</p><button type="button" @click="search = ''; filter = 'all'" class="mt-3 min-h-11 text-sm text-[#ffb700]">Restablecer filtros</button></div>
      <div v-else class="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="barber in filtered" :key="barber._id" class="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-neutral-900/35 p-5">
          <div class="flex items-center gap-4">
            <BarberPortrait :id="barber._id" :name="barber.name" :revision="barber.photoUpdatedAt" class="h-20! w-20 shrink-0 rounded-xl border border-white/10 sm:h-20!" compact />
            <div class="min-w-0"><h2 class="break-words font-barber text-xl leading-tight">{{ barber.name }}</h2><p class="mt-1 break-all text-xs leading-5 text-white/45">{{ barber.email }}</p></div>
          </div>
          <div class="mt-5 flex items-center gap-2 text-xs" :class="scheduleState(barber._id) === 'working' ? 'text-green-400' : scheduleState(barber._id) === 'error' ? 'text-amber-300' : 'text-white/50'"><span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-current" />{{ stateLabel(barber._id) }}</div>
          <p class="mt-2 min-h-10 text-sm leading-5 text-white/65">{{ todayLabel(barber._id) }}</p>
          <dl class="mt-4 grid grid-cols-2 gap-3 border-y border-white/10 py-4">
            <div><dt class="text-xs text-white/45">Pendientes hoy</dt><dd class="mt-1 text-lg tabular-nums">{{ appointmentsError ? "—" : pendingToday(barber._id) }}</dd></div>
            <div><dt class="text-xs text-white/45">Próximas citas</dt><dd class="mt-1 text-lg tabular-nums text-[#ffb700]">{{ appointmentsError ? "—" : futureAppointments(barber._id).length }}</dd></div>
          </dl>
          <div class="mt-4 min-h-14"><p class="text-xs text-white/40">Siguiente reserva</p><p class="mt-1 text-sm leading-5 text-white/75">{{ appointmentsError ? "Sin consultar" : nextLabel(barber._id) }}</p></div>
          <div class="mt-auto flex flex-wrap gap-2 pt-5"><button type="button" @click="selected = barber" class="min-h-11 flex-1 rounded-lg bg-[#ffb700] px-3 text-sm font-medium text-black hover:bg-[#ffc433] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]">Gestionar barbero</button><RouterLink :to="{ name: 'Admin-Appointments', query: { barber: barber._id, view: 'upcoming' } }" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-3 text-sm text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700]">Ver citas</RouterLink></div>
        </article>
      </div>
      <p v-if="barbers.length" class="mt-5 text-xs leading-5 text-white/40">Se muestran barberos con correo confirmado y cuenta habilitada. Los roles y bloqueos se administran en <RouterLink :to="{ name: 'Admin-Customer' }" class="text-white/65 underline underline-offset-4">Usuarios</RouterLink>.</p>
    </template>
    <AdminBarberEditor v-if="selected" :barber="selected" :appointments="appointments" :appointments-error="appointmentsError" @close="selected = null" @updated="onUpdated" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useBarberStore, type Barber } from "@/stores/barber";
import { useAdminStore, type AdminAppointment } from "@/stores/admin";
import BarberAPI from "@/api/barberAPI";
import BarberPortrait from "@/components/UI/BarberPortrait.vue";
import AdminBarberEditor from "@/components/admin/AdminBarberEditor.vue";
import { agendaClock, appointmentDay, appointmentTiming, normalizeAgendaSearch } from "@/helpers/adminAgenda";
import { isBarberSchedule, type BarberSchedule } from "@/helpers/barberSchedule";
const barberStore = useBarberStore(), adminStore = useAdminStore();
const barbers = ref<Barber[]>([]), appointments = ref<AdminAppointment[]>([]);
const schedules = ref<Record<string, BarberSchedule | null | undefined>>({});
const loading = ref(true), error = ref(""), appointmentsError = ref(false);
const search = ref(""), filter = ref("all"), selected = ref<Barber | null>(null), tick = ref(Date.now());
const now = computed(() => agendaClock(new Date(tick.value)));
let refreshVersion = 0;
let alive = true, timer: ReturnType<typeof setInterval> | undefined;
function scheduleState(id: string) {
  const item = schedules.value[id];
  return item === undefined ? "error" : !item ? "missing" : item.schedule.some(day => day.isWorking) ? "working" : "paused";
}
function stateLabel(id: string) {
  return ({ error: "No se pudo consultar el horario", missing: "Jornada por configurar", paused: "Sin días habilitados", working: "Jornada configurada" })[scheduleState(id)];
}
function todayLabel(id: string) {
  if (scheduleState(id) === "error") return "Abre la ficha para volver a consultar.";
  const schedule = schedules.value[id];
  if (!schedule) return "Configura su jornada para recibir reservas.";
  const blocks = schedule.blockedDates.filter(block => String(block.date).slice(0, 10) === now.value.date);
  if (blocks.some(block => !block.startTime || !block.endTime)) return "Hoy tiene una ausencia de día completo.";
  const index = new Date(now.value.date + "T12:00:00Z").getUTCDay();
  const day = schedule.schedule.find(day => day.day === index);
  if (!day?.isWorking) return "Hoy no tiene jornada programada.";
  return "Hoy: " + day.startTime + " a " + day.endTime + (blocks.length ? " · Con bloqueo parcial" : day.breaks?.length ? " · Con pausas" : "");
}
const futureAppointments = (id: string) => appointments.value.filter(item => item.barber?._id === id && appointmentTiming(item, now.value) === "upcoming").sort((a, b) => (appointmentDay(a.date) + a.time).localeCompare(appointmentDay(b.date) + b.time));
const pendingToday = (id: string) => appointments.value.filter(item => item.barber?._id === id && appointmentDay(item.date) === now.value.date && ["upcoming", "current"].includes(appointmentTiming(item, now.value))).length;
function nextLabel(id: string) {
  const next = futureAppointments(id)[0];
  if (!next) return "Sin próximas reservas";
  const date = new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(appointmentDay(next.date) + "T12:00:00Z"));
  return date + " · " + next.time + " · " + (next.user?.name || "Cliente");
}
const statistics = computed(() => [
  { label: "Profesionales habilitados", value: loading.value || error.value ? "—" : barbers.value.length, accent: false },
  { label: "Trabajan hoy", value: loading.value || error.value || barbers.value.some(b => scheduleState(b._id) === "error") ? "—" : barbers.value.filter(barber => todayLabel(barber._id).startsWith("Hoy:")).length, accent: false },
  { label: "Jornadas por configurar", value: loading.value || error.value || barbers.value.some(b => scheduleState(b._id) === "error") ? "—" : barbers.value.filter(barber => scheduleState(barber._id) === "missing").length, accent: false },
  { label: "Citas pendientes hoy", value: loading.value || appointmentsError.value ? "—" : barbers.value.reduce((total, barber) => total + pendingToday(barber._id), 0), accent: true },
]);
const filtered = computed(() => {
  const text = normalizeAgendaSearch(search.value.trim());
  return barbers.value.filter(barber => (!text || normalizeAgendaSearch(barber.name + " " + barber.email).includes(text)) &&
    (filter.value === "all" || scheduleState(barber._id) === filter.value));
});
async function refresh() {
  if (!alive) return;
  const version = ++refreshVersion;
  loading.value = true; error.value = ""; tick.value = Date.now();
  await Promise.all([barberStore.getBarbers(), adminStore.getAllAppointments()]);
  if (!alive || version !== refreshVersion) return;
  error.value = barberStore.error || (!Array.isArray(barberStore.barbers) ? "Respuesta del equipo no válida." : "");
  appointmentsError.value = !!adminStore.error || !Array.isArray(adminStore.appointments);
  appointments.value = appointmentsError.value ? [] : adminStore.appointments;
  barbers.value = error.value ? [] : barberStore.barbers;
  const results = await Promise.all(barbers.value.map(async barber => {
    try {
      const { data } = await BarberAPI.getSchedule(barber._id);
      if (!isBarberSchedule(data)) throw new Error("Horario no válido");
      return [barber._id, data] as const;
    } catch (err: any) { return [barber._id, err?.response?.status === 404 ? null : undefined] as const; }
  }));
  if (!alive || version !== refreshVersion) return;
  schedules.value = Object.fromEntries(results); loading.value = false;
}
function onUpdated(profile?: Partial<Barber>) {
  if (profile && selected.value) Object.assign(selected.value, profile);
  void refresh();
}
onMounted(() => { void refresh(); timer = setInterval(() => { tick.value = Date.now(); }, 30000); });
onBeforeUnmount(() => { alive = false; if (timer) clearInterval(timer); });
</script>
