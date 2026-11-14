<template>
  <section aria-labelledby="performance-title">
    <div class="flex flex-wrap items-start justify-between gap-4"><div><h2 id="performance-title" class="text-xl font-semibold">Mi rendimiento</h2><p class="mt-2 max-w-2xl text-sm leading-6 text-white/50">Resultados de las reservas web atendidas por ti. Las cifras se actualizan cuando guardas la asistencia.</p></div><button type="button" :disabled="loading" @click="load" class="min-h-11 rounded-lg border border-white/15 px-4 text-sm text-white/65 disabled:opacity-40">Actualizar</button></div>
    <div class="my-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap">
      <label class="flex min-h-11 items-center gap-3 text-sm text-white/55">Ver<select v-model="period" @change="load" class="min-h-11 rounded-lg border border-white/15 bg-[#111111] px-3 text-sm text-white"><option value="week">Por semana</option><option value="month">Por mes</option></select></label>
      <div class="col-span-2 flex w-full min-w-0 gap-2 sm:w-[17rem]"><button type="button" @click="move(-1)" :aria-label="period === 'week' ? 'Semana anterior' : 'Mes anterior'" class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15">‹</button><label class="min-w-0 flex-1"><span class="sr-only">Fecha de referencia del período</span><input v-model="reference" type="date" @change="load" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-[#111111] px-3 text-sm text-white" /></label><button type="button" @click="move(1)" :aria-label="period === 'week' ? 'Semana siguiente' : 'Mes siguiente'" class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15">›</button></div>
      <button type="button" @click="reset" class="col-start-2 row-start-1 min-h-11 px-2 text-sm text-[#ffb700]">Período actual</button>
    </div>
    <p v-if="error" role="alert" class="mb-4 rounded-lg border border-rose-400/25 p-4 text-sm text-rose-200">{{ error }}</p>
    <p v-if="loading" role="status" class="py-14 text-center text-sm text-white/50">Calculando tus resultados…</p>
    <template v-else-if="data">
      <p class="mb-4 text-sm text-white/55">{{ panelDate(data.from) }} — {{ panelDate(data.to) }}</p>
      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <article v-for="item in indicators" :key="item.label" class="min-w-0 rounded-xl border border-white/10 bg-[#111] p-4"><header class="flex items-start justify-between gap-1"><h3 class="text-xs text-white/55">{{ item.label }}</h3><DashboardHelp :label="item.label" :text="item.help" /></header><p class="mt-2 break-words text-xl font-semibold tabular-nums" :class="item.accent ? 'text-[#ffb700]' : 'text-white'">{{ item.value }}</p><p class="mt-2 text-[11px] text-white/45">{{ item.detail }}</p></article>
      </div>
      <div class="mt-6 grid gap-4 lg:grid-cols-2"><BarberPerformanceChart :data="data" /><BarberPerformanceChart :data="data" revenue /></div>
      <div class="mt-6 grid gap-4 lg:grid-cols-2">
        <section class="rounded-xl border border-white/10 p-5"><h3 class="text-sm font-medium">Servicios más realizados</h3><ol v-if="data.services.length" class="mt-4 space-y-4"><li v-for="service in data.services" :key="service._id"><div class="flex justify-between gap-3 text-sm"><span class="text-white/70">{{ service.name }}</span><span class="tabular-nums text-white/50">{{ service.count }}</span></div><div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5"><div class="h-full rounded-full bg-[#ffb700]/65" :style="{ width: service.count / Math.max(1, data.services[0]?.count || 1) * 100 + '%' }"></div></div></li></ol><p v-else class="mt-4 text-sm leading-6 text-white/45">Aparecerán cuando guardes las primeras asistencias del período.</p></section>
        <section class="min-w-0 rounded-xl border border-white/10 p-5"><h3 class="text-sm font-medium">Balance del período</h3><dl class="mt-4 divide-y divide-white/10 text-sm"><div v-for="item in insights" :key="item.label" class="flex flex-wrap justify-between gap-3 py-3"><dt class="text-white/50">{{ item.label }}</dt><dd class="tabular-nums text-white/85">{{ item.value }}</dd></div></dl></section>
      </div>
    </template>
  </section>
</template>
<script setup lang="ts">
import DashboardHelp from "@/components/admin/DashboardHelp.vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import API, { type Performance } from "@/api/BarberPanelAPI";
import { chartDays, movePeriod, panelDate, panelMoney } from "@/helpers/barberPanel";
import { agendaClock } from "@/helpers/adminAgenda";
import BarberPerformanceChart from "@/components/UI/BarberPerformanceChart.vue";
const period = ref<"week" | "month">("week"), reference = ref(agendaClock().date), data = ref<Performance | null>(null), loading = ref(false), error = ref("");
const indicators = computed(() => {
 const s=data.value?.summary;if(!s)return [];
 return [
 {label:"Ingresos generados",value:panelMoney(s.revenue),detail:s.attended+" citas atendidas",accent:true,help:"Importe de tus reservas web con asistencia confirmada. No equivale a pagos cobrados, comisiones ni ganancias personales."},
 {label:"Clientes atendidos",value:s.clients,detail:s.services+" servicios realizados",accent:false,help:"Personas diferentes que atendiste en este período. Una cita puede incluir varios servicios."},
 {label:"Próximas citas",value:s.upcoming,detail:"Dentro del período",accent:false,help:"Reservas del período que todavía no han comenzado. No se incluyen como ingresos generados."},
 {label:"Por registrar",value:s.pending,detail:s.noShows+" inasistencias registradas",accent:false,help:"Turnos terminados cuya asistencia no está guardada. Las inasistencias son citas marcadas expresamente como No asistió."}
 ];
});
const insights = computed(() => {
 const s=data.value?.summary;if(!s)return [];
 const best=[...days.value].sort((a,b)=>b.revenue-a.revenue)[0],active=days.value.filter(d=>d.attended>0).length;
 return [
 {label:"Promedio por cita atendida",value:panelMoney(s.attended?s.revenue/s.attended:0)},
 {label:"Asistencia sobre resultados guardados",value:s.attended+s.noShows?Math.round(s.attended/(s.attended+s.noShows)*100)+" %":"Sin resultados"},
 {label:"Días con atenciones",value:active},
 {label:"Día con mayor ingreso",value:best&&best.revenue>0?panelDate(best.date)+" · "+panelMoney(best.revenue):"Sin atenciones"},
 ];
});
let serial = 0;
const days = computed(() => data.value ? chartDays(data.value) : []);
async function load() {
  const request = ++serial; data.value = null; error.value = "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reference.value)) { loading.value = false; error.value = "Selecciona una fecha para consultar el período."; return; }
  loading.value = true;
  try { const response = await API.performance({ period: period.value, reference: reference.value }); if (request === serial) data.value = response.data; }
  catch { if (request === serial) error.value = "No pudimos consultar tu rendimiento. Revisa la fecha y vuelve a intentarlo."; }
  finally { if (request === serial) loading.value = false; }
}
function move(direction: number) { if (reference.value) { reference.value = movePeriod(reference.value, period.value, direction); void load(); } }
function reset() { reference.value = agendaClock().date; void load(); }
onMounted(load); onBeforeUnmount(() => { serial++; });
</script>
