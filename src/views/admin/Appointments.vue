<template>
  <div class="min-w-0 text-white">
    <header class="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0 flex-1"><h1 class="font-barber text-2xl font-light tracking-tight sm:text-3xl">Agenda de citas</h1><p class="mt-2 text-sm leading-6 text-white/55">Revisa los turnos, encuentra una reserva y gestiona sus cambios.</p></div>
      <button type="button" :disabled="loading" aria-label="Actualizar agenda" @click="refresh" class="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 sm:px-4 text-xs font-medium text-white/65 hover:border-white/30 hover:text-white disabled:cursor-wait disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]">
        <svg aria-hidden="true" class="size-4" :class="{ 'motion-safe:animate-spin': loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7v5h-5M4 17v-5h5M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 18 17" /></svg>
        <span class="hidden sm:inline">{{ loading ? "Actualizando…" : "Actualizar" }}</span>
      </button>
    </header>

    <div v-if="filterClient" class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#ffb700]/25 px-4 py-3"><p class="text-sm text-white/70">Reservas de {{ records.find(item => item.user?._id === filterClient)?.user?.name || "la cuenta seleccionada" }}</p><button type="button" @click="filterClient = ''" class="min-h-10 text-xs text-[#ffb700]">Quitar filtro de cliente</button></div>
    <section aria-label="Filtrar citas" class="mb-5 rounded-2xl border border-white/10 bg-neutral-900/40 p-4 sm:p-5">
      <div role="group" aria-label="Vista de agenda" class="mb-4 grid grid-cols-4 gap-1 sm:flex sm:flex-wrap sm:gap-2">
        <button v-for="option in quickOptions" :key="option.value" type="button" :aria-pressed="quickFilter === option.value && !filterDate" @click="selectView(option.value)"
          class="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg border px-1 text-[11px] font-medium sm:min-h-11 sm:flex-row sm:justify-between sm:gap-3 sm:px-3 sm:text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] sm:min-w-28"
          :class="quickFilter === option.value && !filterDate ? 'border-[#ffb700]/35 bg-[#ffb700]/10 text-[#ffb700]' : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white'">
          {{ option.label }} <span class="tabular-nums opacity-65">{{ loading || loadError ? "—" : counts[option.value] }}</span>
        </button>
      </div>
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(140px,1fr)_minmax(150px,1fr)]">
        <div class="col-span-2 min-w-0 lg:col-span-1"><label for="admin-agenda-search" class="mb-2 block text-xs text-white/50">Buscar reserva</label><input id="admin-agenda-search" v-model="search" type="search" placeholder="Cliente, correo, barbero, servicio o referencia" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm placeholder:text-white/30 focus:border-[#ffb700] focus:outline-none" /></div>
        <div id="admin-agenda-extra" class="col-span-2 grid-cols-1 gap-3 min-[420px]:grid-cols-2" :class="extraFiltersOpen ? 'grid' : 'hidden lg:grid'">
        <div><label for="admin-agenda-date" class="mb-2 block text-xs text-white/50">Fecha concreta</label><input id="admin-agenda-date" v-model="filterDate" type="date" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm focus:border-[#ffb700] focus:outline-none" /></div>
        <div><label for="admin-agenda-barber" class="mb-2 block text-xs text-white/50">Profesional</label><select id="admin-agenda-barber" v-model="filterBarber" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm focus:border-[#ffb700] focus:outline-none">
          <option value="">Todos los profesionales</option><option v-for="barber in barberOptions" :key="barber.id" :value="barber.id">{{ barber.name }}</option>
        </select></div>
        </div>
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
        <button type="button" @click="extraFiltersOpen = !extraFiltersOpen" :aria-expanded="extraFiltersOpen" aria-controls="admin-agenda-extra" class="inline-flex min-h-10 items-center gap-2 text-xs text-white/65 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700] lg:hidden">Fecha y profesional{{ extraFilterCount ? " · " + extraFilterCount : "" }}<svg aria-hidden="true" class="size-3.5" :class="{ 'rotate-180': extraFiltersOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
        <label class="flex flex-wrap items-center gap-2 text-xs text-white/50">Asistencia<select v-model="attendanceFilter" class="min-h-10 rounded-lg border border-white/15 bg-neutral-950 px-3 text-xs text-white/80 focus:outline-[#ffb700]"><option value="">Todas</option><option value="attended">Atención confirmada</option><option value="no_show">No asistió</option><option value="pending">Sin registrar</option></select></label>
        <button v-if="hasFilters" type="button" @click="clearFilters" class="min-h-10 text-xs text-white/55 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700]">Restablecer filtros</button>
      </div>
    </section>

    <div v-if="loading" role="status" class="space-y-3"><span class="sr-only">Consultando agenda</span><div v-for="n in 3" :key="n" aria-hidden="true" class="h-28 rounded-xl border border-white/10 bg-white/5 motion-safe:animate-pulse" /></div>
    <div v-else-if="loadError" role="alert" class="rounded-2xl border border-amber-400/20 bg-neutral-900/50 p-6">
      <h2 class="font-barber text-xl">No pudimos consultar las citas</h2><p class="mt-2 text-sm leading-6 text-white/55">Vuelve a intentarlo para ver la agenda actualizada.</p><button type="button" @click="refresh" class="mt-4 min-h-11 rounded-lg border border-[#ffb700]/35 px-4 text-sm text-[#ffb700] hover:bg-[#ffb700]/10 focus-visible:outline-2 focus-visible:outline-[#ffb700]">Volver a consultar</button>
    </div>

    <template v-else>
      <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div aria-live="polite" aria-atomic="true"><h2 class="text-sm font-medium">{{ filtered.length }} {{ filtered.length === 1 ? "cita encontrada" : "citas encontradas" }}</h2><p class="mt-1 text-xs leading-5 text-white/45">{{ formatCurrency(filteredAmount) }} de importe reservado en esta selección</p></div>
        <label class="flex items-center gap-2 text-xs text-white/45">Ordenar <select v-model="sortOrder" class="min-h-10 rounded-lg border border-white/10 bg-neutral-900 px-3 text-xs text-white/75 focus:border-[#ffb700] focus:outline-none"><option value="asc">Fecha ascendente</option><option value="desc">Fecha descendente</option></select></label>
      </div>

      <div v-if="!filtered.length" class="rounded-2xl border border-white/10 bg-neutral-900/30 px-5 py-10 text-center">
        <h2 class="font-barber text-xl">{{ records.length ? "No hay citas con esta selección" : "La agenda todavía está vacía" }}</h2>
        <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">{{ records.length ? "Prueba otra fecha, cambia de profesional o consulta todas las reservas." : "Las reservas de tus clientes aparecerán aquí con sus horarios y detalles." }}</p>
        <button v-if="records.length" type="button" @click="showAll" class="mt-5 min-h-11 rounded-lg border border-[#ffb700]/35 px-4 text-sm text-[#ffb700] hover:bg-[#ffb700]/10 focus-visible:outline-2 focus-visible:outline-[#ffb700]">Ver todas las citas</button>
      </div>

      <div v-else class="space-y-5">
        <div aria-hidden="true" class="hidden grid-cols-[100px_minmax(0,1fr)_minmax(0,1fr)_85px_240px] gap-4 px-4 text-[11px] text-white/35 lg:grid"><span>Hora</span><span>Cliente</span><span>Profesional y servicios</span><span class="text-right">Importe</span><span class="text-right">Acciones</span></div>
        <section v-for="group in groups" :key="group.date" :aria-label="agendaDateLabel(group.date)">
          <header class="mb-2 flex items-center justify-between gap-4"><h3 class="text-sm font-medium text-white/70 first-letter:uppercase">{{ groupLabel(group.date) }}</h3><span class="text-xs text-white/35">{{ group.items.length }} en esta página</span></header>
          <div class="space-y-2.5">
            <article v-for="appointment in group.items" :key="appointment._id" :aria-label="'Cita de ' + (appointment.user?.name || 'cliente no disponible')"
              class="grid min-w-0 grid-cols-2 items-center gap-x-4 gap-y-4 rounded-xl border bg-neutral-900/40 p-4 lg:grid-cols-[100px_minmax(0,1fr)_minmax(0,1fr)_85px_240px]"
              :class="timing(appointment) === 'current' ? 'border-[#ffb700]/30' : 'border-white/10'">
              <div class="order-1 min-w-0">
                <p class="text-xl font-semibold leading-tight tabular-nums text-white">{{ appointment.time }}</p>
                <p v-if="appointment.attendance && appointment.attendance !== 'pending'" class="mt-2 text-[11px]" :class="appointment.attendance === 'attended' ? 'text-green-400' : 'text-red-300'">{{ attendanceLabel(appointment.attendance) }}</p>
                <p class="mt-1.5 text-[11px]" :class="timing(appointment) === 'current' ? 'text-[#ffb700]' : timing(appointment) === 'past' ? 'text-white/35' : 'text-green-300/80'">{{ timingLabel(appointment) }}</p>
              </div>
              <div class="order-3 min-w-0 lg:order-2">
                <p class="mb-1 text-[10px] text-white/35 lg:sr-only">Cliente</p><p class="break-words text-sm font-medium leading-5 text-white/90">{{ appointment.user?.name || "Cliente no disponible" }}</p>
                <p class="mt-1 truncate text-xs text-white/40" :title="appointment.user?.email || ''">{{ appointment.user?.email || "Sin correo disponible" }}</p>
                <p class="mt-1 text-[10px] text-white/30">#{{ appointment._id.slice(-6).toUpperCase() }}</p>
              </div>
              <div class="order-4 min-w-0 lg:order-3">
                <p class="mb-1 text-[10px] text-white/35 lg:sr-only">Profesional y servicios</p><p class="break-words text-sm leading-5 text-white/75">{{ appointment.barber?.name || "Profesional no disponible" }}</p>
                <p class="mt-1 break-words text-xs leading-5 text-white/40">{{ serviceNames(appointment) }}</p>
              </div>
              <div class="order-2 min-w-0 text-right lg:order-4"><p class="text-[10px] text-white/35 lg:sr-only">Importe</p><p class="break-words text-sm font-semibold tabular-nums text-[#ffb700]">{{ formatCurrency(appointment.totalAmount) }}</p></div>
              <div class="order-5 col-span-2 flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 lg:col-span-1 lg:flex-nowrap lg:justify-end lg:border-0 lg:pt-0">
                <button type="button" @click="open('detail', appointment)" class="min-h-11 flex-1 rounded-lg border border-white/15 px-3 text-xs text-white/70 hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700] lg:flex-none" :aria-label="'Detalles de la cita de ' + (appointment.user?.name || 'cliente')">Detalles</button>
                <button v-if="appointmentEditable(appointment, now)" type="button" @click="open('edit', appointment)" class="min-h-11 flex-1 rounded-lg border border-[#ffb700]/25 px-3 text-xs text-[#ffb700] hover:bg-[#ffb700]/10 focus-visible:outline-2 focus-visible:outline-[#ffb700] lg:flex-none" :aria-label="'Editar cita de ' + (appointment.user?.name || 'cliente')">Editar</button>
                <button v-if="appointmentEditable(appointment, now)" type="button" @click="open('cancel', appointment)" class="min-h-11 flex-1 rounded-lg border border-white/10 px-3 text-xs text-white/45 hover:border-red-400/35 hover:bg-red-400/5 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-red-300 lg:flex-none" :aria-label="'Cancelar cita de ' + (appointment.user?.name || 'cliente')">Cancelar</button>
              </div>
            </article>
          </div>
        </section>
      </div>

      <nav v-if="filtered.length" aria-label="Páginas de citas" class="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/45"><p>{{ firstResult }}–{{ lastResult }} de {{ filtered.length }} citas</p><label class="flex items-center gap-2">Por página <select v-model.number="pageSize" class="min-h-10 rounded-lg border border-white/10 bg-neutral-900 px-2 text-white/70 focus:outline-[#ffb700]"><option :value="12">12</option><option :value="24">24</option><option :value="48">48</option></select></label></div>
        <div class="flex items-center gap-2"><button type="button" :disabled="currentPage <= 1" @click="page = currentPage - 1" class="min-h-11 rounded-lg border border-white/15 px-3 text-xs text-white/70 hover:bg-white/5 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#ffb700]">Anterior</button><span class="px-1 text-xs tabular-nums text-white/45">{{ currentPage }} / {{ totalPages }}</span><button type="button" :disabled="currentPage >= totalPages" @click="page = currentPage + 1" class="min-h-11 rounded-lg border border-white/15 px-3 text-xs text-white/70 hover:bg-white/5 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#ffb700]">Siguiente</button></div>
      </nav>
      <p class="mt-4 text-[11px] leading-5 text-white/35">El horario y la asistencia se muestran por separado. Las citas finalizadas se conservan en el historial; puedes revisar y corregir su asistencia desde Detalles.</p>
    </template>

    <AdminAppointmentDialog :mode="mode" :appointment="selected" @close="close" @changed="refresh" @edit="appointment => open('edit', appointment)" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAdminStore, type AdminAppointment } from "@/stores/admin";
import AdminAppointmentDialog from "@/components/admin/AdminAppointmentDialog.vue";
import { formatCurrency } from "@/helpers";
import { agendaClock, agendaDateLabel, appointmentDay, appointmentTiming, filterAdminAppointments, appointmentEditable, attendanceLabel, type AgendaView } from "@/helpers/adminAgenda";

const adminStore = useAdminStore();
const route = useRoute();
const attendanceFilter = ref("");
const search = ref(""), filterDate = ref(""), filterBarber = ref(""), filterClient = ref("");
const extraFiltersOpen = ref(false);
const extraFilterCount = computed(() => Number(!!filterDate.value) + Number(!!filterBarber.value));
const quickFilter = ref<AgendaView>("today");
watch(() => [route.query.barber, route.query.view, route.query.client], () => {
  filterClient.value = ""; filterBarber.value = "";
  const client = route.query.client;
  if (typeof client === "string" && /^[a-f\d]{24}$/i.test(client)) { filterClient.value = client; quickFilter.value = "all"; }
  const id = route.query.barber;
  if (typeof id === "string" && /^[a-f\d]{24}$/i.test(id)) {
    filterBarber.value = id; quickFilter.value = route.query.view === "upcoming" ? "upcoming" : "all"; extraFiltersOpen.value = true;
  }
}, { immediate: true });
const sortOrder = ref<"asc" | "desc">("asc");
const page = ref(1), pageSize = ref(12);
const clock = ref(Date.now()), now = computed(() => agendaClock(new Date(clock.value)));
const ready = ref(false), refreshing = ref(false), dataError = ref(false);
const loading = computed(() => !ready.value || refreshing.value || adminStore.loading);
const loadError = computed(() => !!adminStore.error || dataError.value);
const records = computed(() => Array.isArray(adminStore.appointments) ? adminStore.appointments : []);
const timing = (appointment: AdminAppointment) => appointmentTiming(appointment, now.value);
const timingLabel = (appointment: AdminAppointment) => {
  const status = timing(appointment);
  return status === "current" ? "En horario" : status === "past" ? "Hora pasada" : status === "unknown" ? "Por revisar" : appointmentDay(appointment.date) === now.value.date ? "Por comenzar" : "Próxima";
};
const quickOptions: { value: AgendaView; label: string }[] = [
  { value: "today", label: "Hoy" }, { value: "upcoming", label: "Próximas" }, { value: "past", label: "Pasadas" }, { value: "all", label: "Todas" },
];
const counts = computed(() => ({
  today: records.value.filter(appointment => appointmentDay(appointment.date) === now.value.date).length,
  upcoming: records.value.filter(appointment => timing(appointment) === "upcoming").length,
  past: records.value.filter(appointment => timing(appointment) === "past").length,
  all: records.value.length,
}));
const barberOptions = computed(() => {
  const map = new Map<string, string>();
  for (const appointment of records.value) if (appointment.barber?._id) map.set(appointment.barber._id, appointment.barber.name);
  return [...map].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name, "es"));
});
const filtered = computed(() => filterAdminAppointments(records.value.filter(item => !attendanceFilter.value || (item.attendance || "pending") === attendanceFilter.value), { search: search.value, date: filterDate.value, barber: filterBarber.value, client: filterClient.value, view: quickFilter.value, order: sortOrder.value }, now.value));
const filteredAmount = computed(() => filtered.value.reduce((sum, appointment) => sum + Math.round((Number(appointment.totalAmount) || 0) * 100), 0) / 100);
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));
const currentPage = computed(() => Math.min(page.value, totalPages.value));
const firstResult = computed(() => filtered.value.length ? (currentPage.value - 1) * pageSize.value + 1 : 0);
const lastResult = computed(() => Math.min(currentPage.value * pageSize.value, filtered.value.length));
const groups = computed(() => {
  const map = new Map<string, AdminAppointment[]>();
  for (const appointment of filtered.value.slice(firstResult.value - 1, lastResult.value)) {
    const key = appointmentDay(appointment.date);
    const group = map.get(key) ?? []; group.push(appointment); map.set(key, group);
  }
  return [...map].map(([date, items]) => ({ date, items }));
});
const groupLabel = (date: string) => (date === now.value.date ? "Hoy · " : "") + agendaDateLabel(date);
const serviceNames = (appointment: AdminAppointment) => (appointment.services ?? []).filter(Boolean).map(service => service.name).join(" · ") || "Servicios no disponibles";
const hasFilters = computed(() => !!attendanceFilter.value || !!search.value || !!filterDate.value || !!filterBarber.value || !!filterClient.value || quickFilter.value !== "today");
function selectView(value: AgendaView) { filterDate.value = ""; quickFilter.value = value; sortOrder.value = value === "past" ? "desc" : "asc"; }
function clearFilters() { attendanceFilter.value = ""; extraFiltersOpen.value = false; search.value = ""; filterDate.value = ""; filterBarber.value = ""; filterClient.value = ""; quickFilter.value = "today"; sortOrder.value = "asc"; }
function showAll() { clearFilters(); quickFilter.value = "all"; }
watch(filterDate, value => { if (value) quickFilter.value = "all"; });
watch([attendanceFilter, search, filterDate, filterBarber, filterClient, quickFilter, sortOrder, pageSize], () => { page.value = 1; });

const mode = ref<"detail" | "edit" | "cancel" | null>(null);
const selected = ref<AdminAppointment | null>(null);
function open(value: "detail" | "edit" | "cancel", appointment: AdminAppointment) { if (value !== "detail" && !appointmentEditable(appointment, now.value)) return; selected.value = appointment; mode.value = value; }
function close() { mode.value = null; selected.value = null; }
async function refresh() {
  if (refreshing.value) return;
  refreshing.value = true; dataError.value = false;
  try {
    await adminStore.getAllAppointments();
    if (!Array.isArray(adminStore.appointments)) { adminStore.appointments = []; dataError.value = true; }
  } finally { clock.value = Date.now(); ready.value = true; refreshing.value = false; }
}
let clockTimer: ReturnType<typeof setInterval> | undefined;
onMounted(() => { void refresh(); clockTimer = setInterval(() => { clock.value = Date.now(); }, 30000); });
onBeforeUnmount(() => clearInterval(clockTimer));
</script>
