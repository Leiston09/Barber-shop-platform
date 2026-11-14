<template>
  <div class="min-w-0 text-white">
    <header class="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="font-barber text-2xl font-light tracking-tight sm:text-3xl">Resumen del negocio</h1>
        
      </div>
      <button type="button" :disabled="loading" @click="refresh"
        class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] disabled:cursor-wait disabled:opacity-50 motion-reduce:transition-none">
        <svg aria-hidden="true" class="size-4" :class="{ 'motion-safe:animate-spin': loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7v5h-5M4 17v-5h5M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 18 17" /></svg>
        {{ loading ? "Actualizando…" : "Actualizar" }}
      </button>
    </header>

    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div role="group" aria-label="Periodo del resumen" class="inline-flex rounded-lg border border-white/10 bg-white/[0.02] p-1">
        <button v-for="option in periods" :key="option" type="button" :aria-pressed="period === option" @click="period = option"
          class="min-h-9 rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] motion-reduce:transition-none sm:px-4"
          :class="period === option ? 'bg-[#ffb700] text-black' : 'text-white/60 hover:text-white'">{{ option }} días</button>
      </div>
      <p class="text-xs leading-5 text-white/45">Últimos {{ period }} días · {{ dateRange(summary.start, summary.end) }}</p>
    </div>

    <div v-if="loading" role="status" class="space-y-4">
      <p class="sr-only">Consultando resultados del salón</p>
      <div aria-hidden="true" class="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="h-28 rounded-xl border border-white/10 bg-white/5 motion-safe:animate-pulse" />
      </div>
      <div aria-hidden="true" class="h-72 rounded-2xl border border-white/10 bg-white/[0.03] motion-safe:animate-pulse" />
    </div>

    <div v-else-if="dashboardError" role="alert" class="rounded-2xl border border-amber-400/20 bg-neutral-900/70 px-5 py-8">
      <h2 class="font-barber text-xl">No pudimos consultar los resultados</h2>
      <p class="mt-2 max-w-lg text-sm leading-6 text-white/60">Vuelve a actualizar para ver los datos del salón. No mostraremos cifras vacías como si fueran resultados.</p>
      <button type="button" @click="refresh" class="mt-4 min-h-11 rounded-lg border border-[#ffb700]/35 px-4 text-sm text-[#ffb700] hover:bg-[#ffb700]/10 focus-visible:outline-2 focus-visible:outline-[#ffb700]">Volver a consultar</button>
    </div>

    <template v-else>
      <section aria-label="Indicadores del periodo" class="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article v-for="stat in stats" :key="stat.label" class="min-w-0 rounded-xl border border-white/10 bg-neutral-900/40 px-4 py-3">
          <div class="flex items-center justify-between gap-2"><h2 class="text-xs font-medium text-white/60">{{ stat.label }}</h2><DashboardHelp :label="stat.label" :text="stat.help" /></div>
          <p class="mt-1 break-words text-2xl font-semibold tabular-nums" :class="stat.highlight ? 'text-[#ffb700]' : 'text-white'">{{ stat.value }}</p>
          <div class="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]"><span class="text-white/45">{{ stat.secondary }}</span><span :class="stat.warning ? 'text-amber-300' : 'text-white/55'">{{ stat.detail }}</span></div>
        </article>
      </section>
      <div class="mb-4 grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
        <section aria-labelledby="activity-title" class="min-w-0 rounded-2xl border border-white/10 bg-neutral-900/40 p-4 sm:p-5">
          <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="activity-title" class="font-barber text-xl">Evolución de reservas</h2>
              <DashboardHelp label="Evolución de reservas" :text="'Compara el volumen de reservas o los ingresos de citas atendidas entre fechas. Cada punto representa ' + summary.groupSize + (summary.groupSize === 1 ? ' día.' : ' días.') + ' Pulsa un punto para consultar su valor; también puedes abrir la tabla.'" />
            </div>
            <div role="group" aria-label="Medida del gráfico" class="flex gap-1 rounded-lg bg-black/25 p-1">
              <button v-for="option in chartMetrics" :key="option.value" type="button" @click="metric = option.value" :aria-pressed="metric === option.value"
                class="min-h-9 rounded-md px-3 text-xs focus-visible:outline-2 focus-visible:outline-[#ffb700]"
                :class="metric === option.value ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white'">{{ option.label }}</button>
            </div>
          </header>

          <div class="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs" aria-live="polite" aria-atomic="true">
            <span class="text-white/50">{{ dateRange(selectedBucket.start, selectedBucket.end) }}</span>
            <span class="font-medium tabular-nums text-white/85">{{ metric === "count" ? selectedBucket.count + " " + plural(selectedBucket.count) : formatCurrency(selectedBucket.revenue) }}</span>
          </div>

          <div v-if="summary.count" class="relative mt-4 pl-10 sm:pl-12">
            <div aria-hidden="true" class="absolute inset-y-0 left-0 flex w-9 flex-col justify-between pb-0 text-right text-[10px] tabular-nums text-white/35 sm:w-11">
              <span>{{ axisValue(chartMax) }}</span><span>{{ axisValue(chartMax / 2) }}</span><span>0</span>
            </div>
            <div class="relative h-44">
              <div aria-hidden="true" class="pointer-events-none absolute inset-0 flex flex-col justify-between"><span class="border-t border-white/10" /><span class="border-t border-white/5" /><span class="border-t border-white/10" /></div>
              <svg aria-hidden="true" class="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1000 176" preserveAspectRatio="none">
                <path :d="chartPath + ' L1000 176 L0 176 Z'" fill="#ffb700" fill-opacity=".055" />
                <path :d="chartPath" fill="none" stroke="#ffb700" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div role="group" aria-label="Actividad por fecha" class="relative flex h-full">
                <button v-for="(bucket, index) in summary.buckets" :key="bucket.start" type="button" @mouseenter="selectedIndex = index" @focus="selectedIndex = index" @click="selectedIndex = index"
                  :aria-label="dateRange(bucket.start, bucket.end) + ': ' + (metric === 'count' ? bucket.count + ' reservas' : formatCurrency(bucket.revenue))" :aria-pressed="activeBucketIndex === index"
                  class="relative h-full min-w-0 flex-1 focus-visible:outline-2 focus-visible:outline-[#ffb700]" :class="activeBucketIndex === index ? 'bg-white/[0.035]' : 'hover:bg-white/[0.02]'">
                  <span aria-hidden="true" class="absolute left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#ffb700] bg-neutral-950" :class="{ 'bg-[#ffb700]!': activeBucketIndex === index }" :style="{ bottom: Math.max(2, (metric === 'count' ? bucket.count : bucket.revenue) / chartMax * 96) + '%' }" />
                </button>
              </div>
            </div>
            <div aria-hidden="true" class="mt-2 flex justify-between gap-3 text-[10px] text-white/40"><span>{{ shortDate(summary.start) }}</span><span>{{ shortDate(summary.end) }}</span></div>
          </div>
          <div v-else class="mt-4 flex min-h-48 flex-col items-center justify-center rounded-xl bg-white/[0.02] px-4 text-center">
            <p class="text-sm text-white/70">No hay reservas en este periodo</p>
            <p class="mt-2 max-w-xs text-xs leading-5 text-white/40">Prueba otro rango para consultar la actividad registrada.</p>
          </div>

          <details v-if="summary.count" class="mt-4">
            <summary class="w-fit cursor-pointer text-xs text-white/50 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700]">Ver datos del gráfico</summary>
            <div class="mt-3 overflow-x-auto">
              <table class="w-full text-left text-xs">
                <caption class="sr-only">Reservas e importes por intervalo</caption>
                <thead class="text-white/45"><tr><th scope="col" class="py-2 pr-3 font-medium">Fechas</th><th scope="col" class="py-2 pr-3 text-right font-medium">Reservas</th><th scope="col" class="py-2 text-right font-medium">Ingresos generados</th></tr></thead>
                <tbody><tr v-for="bucket in summary.buckets" :key="bucket.start" class="border-t border-white/5 text-white/70"><th scope="row" class="py-2 pr-3 font-normal">{{ dateRange(bucket.start, bucket.end) }}</th><td class="py-2 pr-3 text-right tabular-nums">{{ bucket.count }}</td><td class="py-2 text-right tabular-nums">{{ formatCurrency(bucket.revenue) }}</td></tr></tbody>
              </table>
            </div>
          </details>
        </section>

        <section aria-labelledby="today-title" class="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-neutral-900/40 p-4 sm:p-5">
          <header class="flex items-baseline justify-between gap-3">
            <h2 id="today-title" class="font-barber text-xl">Hoy en el salón</h2>
            <div class="flex items-center gap-2"><span class="text-xs text-white/45">{{ shortDate(summary.today) }}</span><DashboardHelp label="Hoy en el salón" text="La agenda de hoy y el siguiente turno se consultan independientemente del período del gráfico. Por comenzar excluye turnos que ya empezaron." /></div>
          </header>
          <dl class="mt-5 grid grid-cols-2 gap-4">
            <div><dt class="text-xs text-white/50">Citas de hoy</dt><dd class="mt-2 text-2xl font-semibold tabular-nums">{{ summary.todayCount }}</dd></div>
            <div><dt class="text-xs text-white/50">Por comenzar</dt><dd class="mt-2 text-2xl font-semibold tabular-nums text-[#ffb700]">{{ summary.todayUpcoming }}</dd></div>
          </dl>
          <div class="mt-5 flex-1 rounded-xl bg-black/25 p-4">
            <h3 class="text-xs font-medium text-white/45">Próximo turno</h3>
            <template v-if="summary.nextAppointment">
              <p class="mt-3 text-lg font-semibold tabular-nums text-white">{{ summary.nextAppointment.time }} <span class="ml-1 text-xs font-normal text-white/50">{{ shortDate(summary.nextAppointment.date.slice(0, 10)) }}</span></p>
              <p class="mt-2 break-words text-sm text-white/85">{{ summary.nextAppointment.user?.name || "Cliente no disponible" }}</p>
              <p class="mt-1 break-words text-xs leading-5 text-white/45">Con {{ summary.nextAppointment.barber?.name || "profesional no disponible" }}</p>
            </template>
            <p v-else class="mt-3 text-sm leading-6 text-white/55">No hay turnos por comenzar.</p>
          </div>
          <RouterLink :to="{ name: 'Admin-Appointments' }" class="mt-4 flex min-h-11 items-center justify-between gap-3 rounded-lg border border-white/10 px-4 text-xs text-white/70 hover:border-[#ffb700]/30 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]">
            Ver agenda completa
            <svg aria-hidden="true" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </RouterLink>
        </section>
      </div>

      <div class="grid items-stretch gap-4 lg:grid-cols-2">
        <section v-for="ranking in rankings" :key="ranking.id" :aria-labelledby="ranking.id" class="min-w-0 rounded-2xl border border-white/10 bg-neutral-900/40 p-4 sm:p-5">
          <header class="flex items-center justify-between gap-3"><h2 :id="ranking.id" class="text-base font-medium">{{ ranking.title }}</h2><DashboardHelp :label="ranking.title" :text="ranking.description" /></header>
          <ol v-if="ranking.items.length" class="mt-5 space-y-4">
            <li v-for="item in ranking.items" :key="item.id">
              <div class="mb-2 flex items-start justify-between gap-4 text-sm"><span class="min-w-0 break-words text-white/75">{{ item.name }}</span><span class="shrink-0 text-xs tabular-nums text-white/50">{{ item.count }} {{ ranking.unit(item.count) }}</span></div>
              <div aria-hidden="true" class="h-1.5 overflow-hidden rounded-full bg-white/5"><div class="h-full rounded-full" :class="ranking.id === 'popular-services-title' ? 'bg-[#ffb700]/75' : 'bg-white/35'" :style="{ width: item.count / Math.max(1, ranking.items[0]!.count) * 100 + '%' }" /></div>
            </li>
          </ol>
          <p v-else class="py-8 text-sm leading-6 text-white/45">Sin actividad registrada en este periodo.</p>
        </section>
      </div>

      <div class="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-[11px] leading-5 text-white/40">
        
        <p v-if="updatedAt">Actualizado {{ updateTime }} · Hora de Ecuador</p>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import DashboardHelp from "@/components/admin/DashboardHelp.vue";
import { RouterLink } from "vue-router";
import { useBarberStore } from "@/stores/barber";
import { useAdminStore } from "@/stores/admin";
import { formatCurrency } from "@/helpers";
import { buildDashboardSummary, type DashboardPeriod } from "@/helpers/adminDashboard";

const adminStore = useAdminStore(), barberStore = useBarberStore();
const periods: DashboardPeriod[] = [7, 30, 90];
const period = ref<DashboardPeriod>(30);
const metric = ref<"count" | "amount">("count");
const chartMetrics = [{ value: "count" as const, label: "Reservas" }, { value: "amount" as const, label: "Ingresos generados" }];
const clock = ref(Date.now());
const ready = ref(false);
const dataError = ref(false);
const refreshing = ref(false);
const updatedAt = ref<Date | null>(null);
const selectedIndex = ref<number | null>(null);
let clockTimer: ReturnType<typeof setInterval> | undefined;

const loading = computed(() => !ready.value || refreshing.value || adminStore.loading);
const dashboardError = computed(() => !!adminStore.error || !!barberStore.error || dataError.value);
const summary = computed(() => buildDashboardSummary(Array.isArray(adminStore.appointments) ? adminStore.appointments : [], period.value, new Date(clock.value), barberStore.barbers));
const activeBucketIndex = computed(() => selectedIndex.value ?? summary.value.buckets.length - 1);
const selectedBucket = computed(() => summary.value.buckets[activeBucketIndex.value]!);
const plural = (count: number) => count === 1 ? "reserva" : "reservas";
const shortDate = (key: string) => new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(key + "T12:00:00Z"));
const dateRange = (start: string, end: string) => start === end ? shortDate(start) : shortDate(start) + " – " + shortDate(end);
const updateTime = computed(() => updatedAt.value ? new Intl.DateTimeFormat("es-EC", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "America/Guayaquil" }).format(updatedAt.value) : "");

const stats = computed(() => {
  const s = summary.value;
  return [
    { label: "Reservas", value: s.count, secondary: formatCurrency(s.amount) + " reservados", detail: s.countChange === 0 ? "Sin variación" : (s.countChange > 0 ? "+" : "") + s.countChange + " citas", highlight: false, warning: false, help: "Citas e importe reservado del período. La variación compara con los " + period.value + " días anteriores. Las canceladas no cuentan." },
    { label: "Servicios atendidos", value: formatCurrency(s.revenue), secondary: s.attended + " citas atendidas", detail: s.clients + " clientes con reserva", highlight: true, warning: false, help: "Importe de citas atendidas, sin confirmar cobros ni comisiones. Clientes cuenta personas diferentes con reserva." },
    { label: "Por registrar", value: s.pendingAttendance, secondary: "Turnos finalizados", detail: s.pendingAttendance ? "Revisar asistencia" : "Al día", highlight: false, warning: s.pendingAttendance > 0, help: "Turnos terminados sin asistencia registrada. Puedes revisarlos desde el detalle de la cita." },
    { label: "No asistieron", value: s.noShows, secondary: "Citas con inasistencia", detail: s.attended + s.noShows ? Math.round(s.noShows / (s.attended + s.noShows) * 100) + " % de resultados" : "Sin resultados", highlight: false, warning: s.noShows > 0, help: "Citas marcadas como No asistió. El porcentaje se calcula sobre las citas con resultado guardado." },
  ];
});
const outcomes = computed(() => [
  { label: "Atendidas", count: summary.value.attended, color: "bg-[#ffb700]" },
  { label: "No asistieron", count: summary.value.noShows, color: "bg-red-400/80" },
  { label: "Por registrar", count: summary.value.pendingAttendance, color: "bg-white/50" },
  { label: "Sin finalizar", count: Math.max(0, summary.value.count - summary.value.attended - summary.value.noShows - summary.value.pendingAttendance), color: "bg-white/15" },
]);
const chartPath = computed(() => summary.value.buckets.map((bucket, index, all) =>
  (index ? "L" : "M") + ((index + .5) / all.length * 1000) + " " + (176 - Math.max(2, (metric.value === "count" ? bucket.count : bucket.revenue) / chartMax.value * 96) / 100 * 176)
).join(" "));
const chartMax = computed(() => {
  const peak = Math.max(0, ...summary.value.buckets.map(bucket => metric.value === "count" ? bucket.count : bucket.revenue));
  if (metric.value === "count") return Math.max(2, Math.ceil(peak / 2) * 2);
  if (!peak) return 1;
  const scale = 10 ** Math.floor(Math.log10(peak));
  return Math.ceil(peak / scale) * scale;
});
const axisValue = (value: number) => metric.value === "count" ? String(value) : new Intl.NumberFormat("es-EC", { notation: "compact", maximumFractionDigits: 1 }).format(value);
const rankings = computed(() => [
  { id: "popular-services-title", title: "Servicios más solicitados", description: "Los cinco más incluidos en las reservas del periodo.", items: summary.value.services, unit: (count: number) => count === 1 ? "vez" : "veces" },
  { id: "barber-activity-title", title: "Reservas por profesional", description: "Todos los profesionales habilitados y confirmados, ordenados por reservas del periodo.", items: summary.value.professionals, unit: plural },
]);
watch(period, () => { selectedIndex.value = null; });

async function refresh() {
  if (refreshing.value) return;
  refreshing.value = true;
  dataError.value = false;
  try {
    await Promise.all([adminStore.getAllAppointments(), barberStore.getBarbers()]);
    if (!Array.isArray(adminStore.appointments)) {
      dataError.value = true;
      adminStore.appointments = [];
    }
    if (!dashboardError.value) updatedAt.value = new Date();
  } finally {
    clock.value = Date.now();
    ready.value = true;
    refreshing.value = false;
  }
}
onMounted(() => {
  void refresh();
  clockTimer = setInterval(() => { clock.value = Date.now(); }, 60000);
});
onBeforeUnmount(() => clearInterval(clockTimer));
</script>
