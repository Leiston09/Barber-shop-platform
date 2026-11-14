<template>
  <dialog ref="dialog" @cancel.prevent="$emit('close')" @click.self="$emit('close')" aria-labelledby="client-title" class="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#111111] p-0 text-white backdrop:bg-black/80">
    <div class="flex max-h-[90dvh] flex-col">
      <header class="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 p-5"><div><p class="text-xs text-white/45">Cliente de tus reservas web</p><h2 id="client-title" class="mt-1 break-words text-xl font-semibold">{{ data?.client.name || 'Historial del cliente' }}</h2></div><button type="button" @click="$emit('close')" aria-label="Cerrar historial" class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15 text-xl">×</button></header>
      <div class="min-h-0 overflow-y-auto p-5">
        <p v-if="error" role="alert" class="text-sm text-rose-200">{{ error }} <button type="button" @click="load" class="min-h-11 text-[#ffb700]">Reintentar</button></p>
        <p v-if="loading" role="status" class="py-10 text-center text-sm text-white/50">Consultando las citas contigo…</p>
        <template v-else-if="data">
          <dl class="grid grid-cols-2 gap-4 rounded-xl border border-white/10 p-4"><div><dt class="text-xs text-white/45">Asistencias confirmadas</dt><dd class="mt-2 text-xl">{{ data.summary.attended }}</dd></div><div><dt class="text-xs text-white/45">Importe de servicios atendidos</dt><dd class="mt-2 text-xl text-[#ffb700]">{{ panelMoney(data.summary.spent) }}</dd></div><div><dt class="text-xs text-white/45">Reservas contigo</dt><dd class="mt-2 text-base">{{ data.summary.reservations }}</dd></div><div><dt class="text-xs text-white/45">Inasistencias confirmadas</dt><dd class="mt-2 text-base">{{ data.summary.noShows }}</dd></div></dl>
          <p class="mt-3 text-xs leading-5 text-white/45">Solo incluye su relación contigo. El importe corresponde a reservas con asistencia confirmada; no acredita pagos cobrados.</p>
          <p v-if="data.summary.pending" class="mt-3 text-xs leading-5 text-amber-200">{{ data.summary.pending }} citas terminadas sin asistencia registrada no se suman al importe.</p>
          <h3 class="mb-2 mt-6 text-sm font-medium">Servicios y reservas contigo</h3>
          <ul class="divide-y divide-white/10"><li v-for="item in data.items" :key="item._id" class="py-4"><div class="flex items-start justify-between gap-3"><p class="text-sm leading-6 text-white/80">{{ item.services.map(s => s.name).join(', ') || 'Servicio no disponible' }}</p><span class="shrink-0 text-sm tabular-nums text-white/65">{{ panelMoney(item.totalAmount) }}</span></div><p class="mt-1 text-xs text-white/45">{{ panelDate(item.date) }} · {{ item.time }}</p><p class="mt-2 text-xs" :class="item.attendance === 'no_show' ? 'text-rose-300' : 'text-white/55'">{{ appointmentLabel(item) }}</p></li></ul>
          <div v-if="pages > 1" class="mt-3 flex items-center justify-between gap-3"><button type="button" :disabled="page === 1" @click="turn(-1)" class="min-h-11 text-sm text-white/65 disabled:opacity-30">Anterior</button><p class="text-xs text-white/40">{{ page }} de {{ pages }}</p><button type="button" :disabled="page === pages" @click="turn(1)" class="min-h-11 text-sm text-white/65 disabled:opacity-30">Siguiente</button></div>
        </template>
      </div>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import API, { type ClientActivity } from "@/api/BarberPanelAPI";
import { appointmentLabel, panelDate, panelMoney } from "@/helpers/barberPanel";
const props = defineProps<{ clientId: string }>(); defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>(), data = ref<ClientActivity | null>(null), page = ref(1), loading = ref(false), error = ref("");
let serial = 0;
const pages = computed(() => Math.max(1, Math.ceil((data.value?.summary.reservations ?? 0) / 10)));
async function load() {
  const request = ++serial; loading.value = true; error.value = "";
  try { const response = await API.activity(props.clientId, page.value); if (request === serial) data.value = response.data; }
  catch { if (request === serial) { data.value = null; error.value = "No pudimos consultar el historial de este cliente."; } }
  finally { if (request === serial) loading.value = false; }
}
function turn(direction: number) { page.value += direction; void load(); }
onMounted(async () => { await nextTick(); dialog.value?.showModal(); void load(); });
onBeforeUnmount(() => { serial++; dialog.value?.close(); });
</script>
