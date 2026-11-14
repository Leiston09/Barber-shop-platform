<template>
  <section aria-labelledby="appointments-title">
    <div class="flex flex-wrap items-start justify-between gap-3"><div><h2 id="appointments-title" class="text-xl font-semibold">Mis citas</h2><p class="mt-2 text-sm leading-6 text-white/50">Tus próximas reservas y el historial de quienes reservaron contigo.</p></div><button type="button" :disabled="loading" @click="load" class="min-h-11 rounded-lg border border-white/15 px-4 text-sm text-white/65 disabled:opacity-40">Actualizar</button></div>
    <div class="my-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="grid grid-cols-2 gap-1 rounded-lg bg-white/5 p-1"><button v-for="option in [{ id: 'upcoming', label: 'Próximas reservas' }, { id: 'history', label: 'Historial de citas' }]" :key="option.id" type="button" @click="changeView(option.id)" :aria-pressed="view === option.id" class="min-h-11 rounded-md px-3 text-sm" :class="view === option.id ? 'bg-white/10 text-white' : 'text-white/45'">{{ option.label }}</button></div>
      <form @submit.prevent="search" class="flex gap-2 sm:max-w-md sm:flex-1"><label class="min-w-0 flex-1"><span class="sr-only">Buscar cliente o servicio</span><input v-model="query" type="search" maxlength="80" placeholder="Buscar cliente o servicio" class="min-h-11 w-full rounded-lg border border-white/15 bg-[#111111] px-3 text-sm outline-none focus:border-[#ffb700]" /></label><button type="submit" class="min-h-11 rounded-lg border border-white/15 px-3 text-sm text-[#ffb700]">Buscar</button></form>
    </div>
    <p v-if="error" role="alert" class="mb-4 rounded-lg border border-rose-400/25 p-4 text-sm text-rose-200">{{ error }}</p>
    <p v-if="loading" role="status" class="py-14 text-center text-sm text-white/50">Consultando tus reservas…</p>
    <template v-else-if="data">
      <p v-if="!data.items.length" class="rounded-xl border border-white/10 py-16 text-center text-sm text-white/50">{{ appliedSearch ? 'No hay reservas que coincidan con la búsqueda.' : view === 'upcoming' ? 'No tienes próximas reservas web.' : 'Todavía no tienes citas en el historial.' }}</p>
      <div v-else class="divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0e0e0e]">
        <article v-for="item in data.items" :key="item._id" class="grid gap-4 p-4 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:p-5">
          <div><p class="text-lg font-semibold tabular-nums text-[#ffb700]">{{ item.time }}</p><p class="mt-1 text-xs text-white/50">{{ panelDate(item.date) }}</p></div>
          <div class="min-w-0"><h3 class="break-words text-sm font-medium">{{ item.user.name }}</h3><p class="mt-1.5 text-sm leading-6 text-white/50">{{ item.services.map(s => s.name).join(', ') || 'Servicio no disponible' }}</p><p class="mt-2 text-xs" :class="item.attendance === 'no_show' ? 'text-rose-300' : item.attendance === 'attended' ? 'text-[#ffb700]' : 'text-white/40'">{{ appointmentLabel(item) }}</p></div>
          <div class="flex items-center justify-between gap-4 sm:flex-col sm:items-end"><p class="text-sm tabular-nums text-white/75">{{ panelMoney(item.totalAmount) }}</p><button v-if="item.user._id" type="button" @click="selected = item.user._id" class="min-h-11 text-sm text-[#ffb700]">Ver cliente e historial</button></div>
        </article>
      </div>
      <footer v-if="data.total" class="mt-5 flex flex-wrap items-center justify-between gap-3"><p class="text-xs text-white/40">{{ data.total }} reservas · Página {{ page }} de {{ pages }}</p><div class="flex gap-2"><button type="button" :disabled="page <= 1" @click="changePage(-1)" class="min-h-11 rounded-lg border border-white/15 px-4 text-sm disabled:opacity-30">Anterior</button><button type="button" :disabled="page >= pages" @click="changePage(1)" class="min-h-11 rounded-lg border border-white/15 px-4 text-sm disabled:opacity-30">Siguiente</button></div></footer>
    </template>
    <ClientHistoryModal v-if="selected" :client-id="selected" @close="selected = ''" />
  </section>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import API, { type AppointmentPage } from "@/api/BarberPanelAPI";
import { appointmentLabel, panelDate, panelMoney } from "@/helpers/barberPanel";
import ClientHistoryModal from "./ClientHistoryModal.vue";
const view = ref("upcoming"), page = ref(1), query = ref(""), appliedSearch = ref(""), selected = ref("");
const data = ref<AppointmentPage | null>(null), loading = ref(false), error = ref("");
let serial = 0;
const pages = computed(() => Math.max(1, Math.ceil((data.value?.total ?? 0) / 10)));
async function load() {
  const request = ++serial; loading.value = true; error.value = ""; data.value = null;
  try { const response = await API.appointments({ view: view.value, page: page.value, search: appliedSearch.value }); if (request === serial) data.value = response.data; }
  catch { if (request === serial) error.value = "No pudimos consultar tus citas. Pulsa Actualizar para volver a intentarlo."; }
  finally { if (request === serial) loading.value = false; }
}
function changeView(value: string) { view.value = value; page.value = 1; void load(); }
function changePage(direction: number) { page.value += direction; void load(); }
function search() { appliedSearch.value = query.value.trim(); page.value = 1; void load(); }
onMounted(load); onBeforeUnmount(() => { serial++; });
</script>
