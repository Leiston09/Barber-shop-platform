<template>
  <section aria-labelledby="today-title">
    <div class="mb-6 flex flex-wrap items-start justify-between gap-3"><div><h2 id="today-title" class="text-xl font-semibold">Citas de hoy</h2><p class="mt-2 text-sm text-white/50">{{ data ? panelDate(data.date) : 'Consultando tu jornada…' }} · Hora de Ecuador</p></div><button type="button" :disabled="loading || saving" @click="refresh" class="min-h-11 rounded-lg border border-white/15 px-4 text-sm text-white/65 hover:text-white disabled:opacity-40">Actualizar agenda</button></div>
    <p v-if="error" role="alert" class="mb-5 rounded-xl border border-rose-400/25 bg-rose-400/5 p-4 text-sm text-rose-200">{{ error }}</p>
    <p v-if="loading && !data" role="status" class="py-16 text-center text-sm text-white/50">Cargando las reservas de hoy…</p>
    <template v-if="data">
      <div class="mb-5 rounded-xl border border-white/10 bg-[#111111] p-4 sm:p-5"><p class="text-sm font-medium">Revisa la asistencia antes de guardar</p><p class="mt-2 max-w-3xl text-sm leading-6 text-white/50">Confirma los clientes atendidos y señala las inasistencias. El registro de asistencia mantiene actualizados tu rendimiento y las valoraciones de tus clientes.</p><p v-if="data.savedAt" class="mt-3 text-xs text-white/45">Último guardado: {{ savedTime }}. Puedes corregir los resultados de hoy.</p></div>
      <p v-if="!data.items.length" class="rounded-xl border border-white/10 px-5 py-16 text-center text-sm text-white/50">Hoy no tienes reservas web. Aquí aparecerán únicamente los clientes que reservaron contigo.</p>
      <div v-else class="overflow-hidden rounded-xl border border-white/10 bg-[#0e0e0e]">
        <div v-for="item in data.items" :key="item._id" class="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-white/10 p-4 last:border-b-0 sm:grid-cols-[4rem_minmax(0,1fr)_14rem] sm:px-5 sm:py-5">
          <p class="self-start pt-0.5 text-lg font-semibold tabular-nums text-[#ffb700]">{{ item.time }}</p>
          <div class="min-w-0"><h3 class="break-words text-sm font-medium">{{ item.user.name }}</h3><p class="mt-1.5 text-sm leading-6 text-white/50">{{ item.services.map(s => s.name).join(', ') || 'Servicio no disponible' }}</p></div>
          <label class="col-start-2 flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2 text-sm sm:col-start-auto" :class="!item.canRecord ? 'border-white/5 text-white/35' : draft[item._id] ? 'border-[#ffb700]/25 text-white/80' : 'border-rose-400/30 text-rose-200'">
            <input v-model="draft[item._id]" type="checkbox" :disabled="saving || stale || !item.canRecord" :aria-label="'Asistió ' + item.user.name + ' a las ' + item.time" class="size-5 shrink-0 accent-[#ffb700] disabled:opacity-40" />
            <span>{{ !item.canRecord ? 'Turno pendiente' : draft[item._id] ? 'Asistió' : 'No asistió' }}<span v-if="item.canRecord" class="mt-0.5 block text-[11px] text-white/40">{{ savedValue(item) ? 'Guardado' : 'Sin guardar' }}</span></span>
          </label>
        </div>
      </div>
      <footer v-if="data.items.length" class="sticky bottom-[calc(var(--app-mobile-nav-clearance,0px)+0.75rem)] z-10 mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/15 bg-[#151515] p-4 shadow-xl sm:p-5">
        <div><p class="text-sm">{{ eligible.length }} {{ eligible.length === 1 ? 'turno terminado' : 'turnos terminados' }} para revisar</p><p class="mt-1 text-xs leading-5 text-white/45">{{ stale ? 'Actualiza la agenda para continuar.' : 'La selección provisional no se cuenta en tus resultados.' }}</p></div>
        <button type="button" :disabled="saving || loading || stale || !hasChanges" @click="save" class="min-h-12 w-full rounded-lg bg-[#ffb700] px-5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">{{ saving ? 'Guardando resultados…' : 'Guardar asistencia' }}</button>
      </footer>
    </template>
  </section>
</template>
<script setup lang="ts">
import { confirmDialog } from "@/lib/confirmDialog";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import API, { type PanelAppointment, type TodayResponse } from "@/api/BarberPanelAPI";
import { attendanceDraft, attendancePayload, panelDate } from "@/helpers/barberPanel";
import { useToast } from "@/lib/notifications";
const toast = useToast(), data = ref<TodayResponse | null>(null), draft = ref<Record<string, boolean>>({});
const loading = ref(false), saving = ref(false), error = ref(""), stale = ref(false);
let alive = true, timer: ReturnType<typeof setInterval> | undefined;
const eligible = computed(() => data.value?.items.filter(item => item.canRecord) ?? []);
const savedValue = (item: PanelAppointment) => item.attendance !== "pending" && draft.value[item._id] === (item.attendance === "attended");
const hasChanges = computed(() => eligible.value.some(item => !savedValue(item)));
const hasEdited = computed(() => data.value?.items.some(item => draft.value[item._id] !== (item.attendance !== "no_show")) ?? false);
const savedTime = computed(() => data.value?.savedAt ? new Intl.DateTimeFormat("es-EC", { timeZone: "America/Guayaquil", hour: "2-digit", minute: "2-digit" }).format(new Date(data.value.savedAt)) : "");
async function load() {
  if (loading.value || saving.value) return;
  loading.value = true; error.value = "";
  try { const response = await API.today(); if (!alive) return; data.value = response.data; draft.value = attendanceDraft(response.data.items); stale.value = false; }
  catch { if (alive) error.value = "No pudimos consultar tu agenda. Pulsa Actualizar agenda para intentarlo de nuevo."; }
  finally { if (alive) loading.value = false; }
}
async function refresh() { if (!hasEdited.value || await confirmDialog("Hay cambios de asistencia sin guardar. ¿Descartarlos y actualizar?")) void load(); }
async function save() {
  if (!data.value || saving.value || !hasChanges.value || stale.value) return;
  saving.value = true; error.value = "";
  try {
    await API.saveToday({ date: data.value.date, revision: data.value.revision, entries: attendancePayload(data.value.items, draft.value) });
    if (!alive) return;
    for (const item of eligible.value) item.attendance = draft.value[item._id] ? "attended" : "no_show";
    toast.success("Asistencia guardada. Tus resultados ya están actualizados.");
    saving.value = false; await load();
  } catch (err: any) {
    if (!alive) return;
    stale.value = err?.response?.status === 409;
    error.value = stale.value ? "La agenda o su asistencia cambiaron. Tu selección sigue visible; actualiza para revisar los datos actuales." : "No pudimos guardar la asistencia. Tu selección se conserva para volver a intentarlo.";
  } finally { if (alive) saving.value = false; }
}
async function leaving() { return !saving.value && (!hasEdited.value || await confirmDialog("Hay cambios de asistencia sin guardar. ¿Quieres salir sin guardarlos?")); }
function unload(event: BeforeUnloadEvent) { if (hasEdited.value || saving.value) { event.preventDefault(); event.returnValue = ""; } }
onBeforeRouteLeave(leaving);
onMounted(() => {
  void load(); window.addEventListener("beforeunload", unload);
  timer = setInterval(() => {
    if (!data.value || loading.value || saving.value || hasEdited.value) return;
    // Refresh after the end of a turn, without overwriting a manually edited draft.
    const clock = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Guayaquil" }).format(new Date());
    const time = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Guayaquil", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
    if (clock !== data.value.date || data.value.items.some(item => !item.canRecord && Number(item.time.slice(0, 2)) * 60 + Number(item.time.slice(3)) + 60 <= Number(time.slice(0, 2)) * 60 + Number(time.slice(3)))) void load();
  }, 30000);
});
onBeforeUnmount(() => { alive = false; if (timer) clearInterval(timer); window.removeEventListener("beforeunload", unload); });
</script>
