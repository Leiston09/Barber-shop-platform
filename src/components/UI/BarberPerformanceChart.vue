<template>
  <figure class="min-w-0 rounded-xl border border-white/10 bg-[#111111] p-4 sm:p-5">
    <figcaption class="flex flex-wrap items-start justify-between gap-3"><div><h3 class="text-sm font-medium">{{ revenue ? 'Ingresos generados por día' : 'Asistencia por día' }}</h3><p class="mt-1.5 text-xs leading-5 text-white/45">{{ revenue ? 'Importe de reservas web con asistencia confirmada' : 'Resultados guardados, sin selecciones provisionales' }}</p></div></figcaption>
    <div v-if="!revenue" class="mt-4 flex gap-4 text-xs text-white/55"><span class="flex items-center gap-2"><span class="size-2 rounded-sm bg-[#ffb700]"></span>Asistió</span><span class="flex items-center gap-2"><span class="size-2 rounded-sm bg-rose-300"></span>No asistió</span></div>
    <p class="mt-5 text-xs tabular-nums text-white/40">Máximo: {{ revenue ? panelMoney(maximum) : maximum }}</p>
    <svg role="img" :aria-label="revenue ? 'Ingresos diarios del período' : 'Asistencias e inasistencias diarias del período'" viewBox="0 0 640 160" preserveAspectRatio="none" class="mt-2 h-40 w-full">
      <title>{{ revenue ? 'Ingresos generados' : 'Resultados de asistencia' }}</title>
      <path d="M0 1H640M0 79H640M0 158H640" stroke="white" stroke-opacity=".07" stroke-dasharray="3 5" />
      <g v-for="(day, index) in days" v-show="!revenue" :key="day.date">
        <rect :x="index * step + step * .2" :y="158 - height(revenue ? day.revenue : day.attended)" :width="step * (revenue ? .6 : .28)" :height="height(revenue ? day.revenue : day.attended)" rx="1.5" fill="#ffb700"><title>{{ panelDate(day.date) }}: {{ revenue ? panelMoney(day.revenue) : day.attended + ' asistencias' }}</title></rect>
        <rect v-if="!revenue" :x="index * step + step * .53" :y="158 - height(day.noShows)" :width="step * .28" :height="height(day.noShows)" rx="1.5" fill="#fda4af"><title>{{ panelDate(day.date) }}: {{ day.noShows }} inasistencias</title></rect>
      </g>
      <polyline v-if="revenue" :points="linePoints" fill="none" stroke="#ffb700" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
      <circle v-for="(day,index) in revenue ? days : []" :key="'point'+day.date" :cx="index*step+step*.5" :cy="158-height(day.revenue)" r="3" fill="#ffb700"><title>{{ panelDate(day.date) }}: {{ panelMoney(day.revenue) }}</title></circle>
    </svg>
    <div class="mt-2 flex justify-between text-[11px] tabular-nums text-white/35"><span>{{ panelDate(days[0]?.date || data.from) }}</span><span>{{ panelDate(days[days.length - 1]?.date || data.to) }}</span></div>
    <p v-if="!hasResults" class="mt-4 text-xs leading-5 text-white/45">Todavía no hay resultados de asistencia guardados en este período.</p>
  </figure>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { Performance } from "@/api/BarberPanelAPI";
import { chartDays, panelDate, panelMoney } from "@/helpers/barberPanel";
const props = defineProps<{ data: Performance; revenue?: boolean }>();
const days = computed(() => chartDays(props.data));
const maximum = computed(() => Math.max(0, ...days.value.map(day => props.revenue ? day.revenue : Math.max(day.attended, day.noShows))));
const step = computed(() => 640 / Math.max(1, days.value.length));
const height = (value: number) => Math.max(0, value) / (maximum.value || 1) * 150;
const linePoints = computed(() => days.value.map((day,index)=>(index*step.value+step.value*.5)+","+(158-height(day.revenue))).join(" "));
const hasResults = computed(() => days.value.some(day => day.attended || day.noShows));
</script>
