<template>
  <section aria-labelledby="schedule-title">
    <div class="flex flex-wrap items-start justify-between gap-4"><div><h2 id="schedule-title" class="text-xl font-semibold">Mi horario</h2><p class="mt-2 max-w-2xl text-sm leading-6 text-white/50">Organiza tus días de trabajo, pausas y ausencias. Esta disponibilidad se utiliza para las nuevas reservas web.</p></div><button type="button" :disabled="loading" @click="load" class="min-h-11 rounded-lg border border-white/15 px-4 text-sm text-white/65 disabled:opacity-40">Actualizar</button></div>
    <p v-if="error" role="alert" class="mt-5 rounded-lg border border-rose-400/25 p-4 text-sm text-rose-200">{{ error }}</p>
    <p v-if="loading" role="status" class="py-14 text-center text-sm text-white/50">Consultando tu disponibilidad…</p>
    <template v-else-if="!error">
      <div class="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section class="rounded-xl border border-white/10 bg-[#111111] p-5 sm:p-6">
          <div class="flex flex-wrap items-center justify-between gap-3"><h3 class="text-base font-medium">Jornada semanal</h3><span class="text-xs text-white/45">{{ weekly }} turnos por semana</span></div>
          <p v-if="!schedule" class="mt-4 text-sm leading-6 text-amber-200">Todavía no tienes un horario configurado. Define tu jornada para que los clientes puedan reservar contigo.</p>
          <WorkWeekSummary :days="days" />
          <button v-if="barber" type="button" @click="editing = true" class="mt-5 min-h-12 w-full rounded-lg bg-[#ffb700] px-5 text-sm font-semibold text-black">{{ schedule ? 'Editar jornada y ausencias' : 'Configurar mi horario' }}</button>
        </section>
        <div class="space-y-5">
          <section class="rounded-xl border border-white/10 p-5 sm:p-6"><h3 class="text-base font-medium">Próximas ausencias</h3><ul v-if="blocks.length" class="mt-4 divide-y divide-white/10"><li v-for="(block, index) in blocks" :key="index" class="py-3"><p class="text-sm text-white/80">{{ panelDate(block.date) }}</p><p class="mt-1 text-xs text-[#ffb700]">{{ block.startTime ? block.startTime + ' – ' + block.endTime : 'Día completo' }}</p><p v-if="block.reason" class="mt-1 break-words text-xs leading-5 text-white/45">{{ block.reason }}</p></li></ul><p v-else class="mt-4 text-sm leading-6 text-white/45">No tienes ausencias programadas.</p></section>
          <aside class="rounded-xl border border-white/10 p-5 sm:p-6"><h3 class="text-sm font-medium">Antes de cambiar tu disponibilidad</h3><p class="mt-3 text-sm leading-6 text-white/50">Cada reserva ocupa 60 minutos. Si un cambio afecta citas existentes, podrás revisarlas antes de guardar. Modificar el horario no cancela reservas ni envía avisos a los clientes.</p></aside>
        </div>
      </div>
    </template>
    <AdminBarberEditor v-if="editing && barber" :barber="barber" :appointments="[]" :appointments-error="false" self-service @close="editing = false" @updated="load" />
  </section>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import WorkWeekSummary from "@/components/barber/WorkWeekSummary.vue";
import { useUserStore } from "@/stores/user";
import type { Barber } from "@/stores/barber";
import BarberAPI from "@/api/barberAPI";
import { blankSchedule, dailySlots, isBarberSchedule, weekDays, type BarberSchedule } from "@/helpers/barberSchedule";
import { agendaClock } from "@/helpers/adminAgenda";
import { panelDate } from "@/helpers/barberPanel";
import AdminBarberEditor from "@/components/admin/AdminBarberEditor.vue";
const user = useUserStore(), schedule = ref<BarberSchedule | null>(null), loading = ref(false), error = ref(""), editing = ref(false);
let serial = 0;
const barber = computed<Barber | null>(() => user.user ? { _id: user.user._id, name: user.user.name, email: user.user.email, role: "barber" } : null);
const days = computed(() => blankSchedule(schedule.value)), weekly = computed(() => days.value.reduce((sum,day) => sum + dailySlots(day).length, 0));
const blocks = computed(() => (schedule.value?.blockedDates ?? []).filter(block => String(block.date).slice(0,10) >= agendaClock().date).sort((a,b) => String(a.date).localeCompare(String(b.date))));
async function load() {
  if (!barber.value) return;
  const request = ++serial; loading.value = true; error.value = "";
  try { const { data } = await BarberAPI.getSchedule(barber.value._id); if (!isBarberSchedule(data)) throw new Error(); if (request === serial) schedule.value = data; }
  catch (err: any) { if (request === serial) { if (err?.response?.status === 404) schedule.value = null; else error.value = "No pudimos consultar tu horario. Pulsa Actualizar para volver a intentarlo."; } }
  finally { if (request === serial) loading.value = false; }
}
onMounted(load); onBeforeUnmount(() => { serial++; });
</script>
