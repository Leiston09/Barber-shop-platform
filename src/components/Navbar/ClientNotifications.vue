<template>
  <button v-if="total > 0" ref="trigger" type="button" @click="open" aria-haspopup="dialog" :aria-expanded="opened" :aria-label="'Notificaciones' + (unread ? ', ' + unread + ' pendientes' : '')" class="relative flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-[#111111] text-white/70 transition-colors hover:border-[#ffb700]/40 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]">
    <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
    <span v-if="unread" class="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffb700] px-1 text-[10px] font-bold tabular-nums text-black">{{ unread > 99 ? '99+' : unread }}</span>
  </button>
  <dialog ref="dialog" aria-labelledby="client-notices-title" @cancel.prevent="close" @click.self="close" @close="afterClose"
    class="fixed inset-auto right-3 top-[calc(var(--app-header-height,64px)+0.75rem)] m-0 max-h-[calc(100dvh-var(--app-header-height,64px)-1.5rem)] w-[calc(100%-1.5rem)] max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#111111] p-0 text-white shadow-2xl backdrop:bg-black/40 sm:right-6">
    <div class="flex max-h-[calc(100dvh-var(--app-header-height,64px)-1.5rem)] flex-col">
      <header class="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 p-4"><div><h2 id="client-notices-title" class="text-base font-semibold">Tus notificaciones</h2><p class="mt-1 text-xs text-white/45">Atenciones y valoraciones</p></div><button type="button" :disabled="loading || !!saving" @click="load" aria-label="Actualizar notificaciones" title="Actualizar notificaciones" class="ml-auto flex size-11 shrink-0 items-center justify-center rounded-lg text-white/50 hover:text-[#ffb700] disabled:opacity-40"><svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 14 6M18 18a8 8 0 0 1-14-6" /></svg></button><button type="button" autofocus @click="close" aria-label="Cerrar notificaciones" class="flex size-11 items-center justify-center rounded-lg border border-white/10 text-xl text-white/60">×</button></header>
      <div class="min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4">
        <p v-if="error" role="alert" class="mb-3 rounded-lg border border-rose-300/25 p-3 text-xs leading-5 text-rose-200">{{ error }} <button type="button" @click="load" class="min-h-10 text-[#ffb700]">Actualizar</button></p>
        <p v-if="loading && !items.length" role="status" class="py-10 text-center text-sm text-white/50">Consultando tus notificaciones…</p>
        <p v-else-if="!items.length && !error" class="px-3 py-10 text-center text-sm leading-6 text-white/50">No tienes atenciones confirmadas por ahora. Cuando tu barbero registre que te atendió, aparecerá aquí.</p>
        <ul class="space-y-3"><li v-for="item in items" :key="item._id" class="rounded-xl border p-3 sm:p-4" :class="item.read ? 'border-white/10' : 'border-[#ffb700]/30 bg-[#ffb700]/[0.025]'">
          <div class="flex items-start gap-3"><BarberPortrait :id="item.barber._id" :name="item.barber.name" :revision="item.barber.photoUpdatedAt" compact class="h-12! w-12 shrink-0 rounded-lg border border-white/10 sm:h-12!" /><div class="min-w-0 flex-1"><p class="text-sm leading-6"><strong class="font-medium">{{ item.barber.name }}</strong> confirmó tu atención.</p><p class="mt-1 text-xs leading-5 text-white/45">{{ dateLabel(item.date) }} · {{ item.time }}</p></div><span v-if="!item.read" aria-label="Sin leer" class="mt-2 size-2 shrink-0 rounded-full bg-[#ffb700]"></span></div>
          <div class="mt-4 border-t border-white/10 pt-3"><p class="text-xs text-white/60">{{ item.score ? 'Tu valoración' : item.canRate ? '¿Cómo fue tu atención? Valorar es opcional.' : 'Esta reserva ya tiene una valoración.' }}</p>
            <div class="mt-2 flex items-center gap-1" @mouseleave="hover = 0"><button v-for="star in 5" :key="star" type="button" :disabled="!!item.score || !item.canRate || !!saving" @mouseenter="hover = star; hoverId = item._id" @focus="hover = star; hoverId = item._id" @blur="hover = 0" @click="rate(item, star)" :aria-label="'Calificar con ' + star + (star === 1 ? ' estrella' : ' estrellas')" :aria-pressed="item.score === star" class="flex size-11 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:cursor-default" :class="star <= (item.score || (hoverId === item._id ? hover : 0)) ? 'text-[#ffb700]' : 'text-white/25'"><svg aria-hidden="true" class="size-6" viewBox="0 0 24 24" :fill="star <= (item.score || (hoverId === item._id ? hover : 0)) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m12 3 2.8 5.7 6.3.9-4.55 4.4 1.08 6.25L12 17.3l-5.63 2.95 1.08-6.25L2.9 9.6l6.3-.9L12 3Z" /></svg></button></div>
            <p v-if="saving === item._id" role="status" class="mt-1 text-xs text-white/45">Guardando…</p><p v-else-if="item.score" class="mt-1 text-xs text-[#ffb700]">{{ item.score }} de 5 · Guardado automáticamente</p>
            <p v-if="itemError[item._id]" role="alert" class="mt-2 text-xs leading-5 text-rose-200">{{ itemError[item._id] }}</p>
            <button v-if="!item.read" type="button" :disabled="!!saving" @click="read(item)" class="mt-2 min-h-10 text-xs text-white/50 underline decoration-white/20 underline-offset-4 hover:text-white disabled:opacity-40">Marcar como leída</button>
          </div>
        </li></ul>
        <div v-if="total > 10" class="mt-4 flex items-center justify-between gap-3"><button type="button" :disabled="page === 1 || loading || !!saving" @click="turn(-1)" class="min-h-11 text-sm text-white/65 disabled:opacity-30">Anterior</button><span class="text-xs text-white/40">{{ page }} de {{ Math.ceil(total / 10) }}</span><button type="button" :disabled="page >= Math.ceil(total / 10) || loading || !!saving" @click="turn(1)" class="min-h-11 text-sm text-white/65 disabled:opacity-30">Siguiente</button></div>
      </div>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { toast } from "@/lib/notifications";
import API, { type ClientNotice } from "@/api/ClientNotificationsAPI";
import BarberPortrait from "@/components/UI/BarberPortrait.vue";
const user = useUserStore(), trigger = ref<HTMLButtonElement>(), dialog = ref<HTMLDialogElement>();
const items = ref<ClientNotice[]>([]), unread = ref(0), total = ref(0), page = ref(1), loading = ref(false), opened = ref(false), error = ref("");
const saving = ref(""), hover = ref(0), hoverId = ref(""), itemError = ref<Record<string, string>>({});
let alive = true, serial = 0, timer: ReturnType<typeof setInterval> | undefined;
const dateLabel = (date: string) => new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date.slice(0,10) + "T12:00:00Z"));
async function load() {
  if (saving.value || loading.value) return;
  const request = ++serial, owner = user.user?._id; loading.value = true;
  try {
    const { data } = await API.list(page.value);
    if (!alive || request !== serial || user.user?._id !== owner) return;
    items.value = data.items; unread.value = data.unreadCount; total.value = data.total; error.value = ""; itemError.value = {};
  } catch { if (alive && request === serial) error.value = "No pudimos consultar tus notificaciones. Puedes volver a intentarlo."; }
  finally { if (alive && request === serial) loading.value = false; }
}
async function open() { toast.clear(); opened.value = true; await nextTick(); dialog.value?.showModal(); void load(); }
function close() { dialog.value?.close(); }
function afterClose() { opened.value = false; hover.value = 0; trigger.value?.focus(); }
function turn(direction: number) { page.value += direction; void load(); }
async function rate(item: ClientNotice, score: number) {
  if (saving.value || item.score || !item.canRate) return;
  serial++; loading.value = false; saving.value = item._id; itemError.value[item._id] = "";
  try {
    await API.rate(item._id, score); if (!alive) return;
    items.value = items.value.filter(notice => notice._id !== item._id); total.value = Math.max(0,total.value-1);
    if (!total.value) close();
    window.dispatchEvent(new Event("appsalon:rating-saved"));
    if (!item.read) { item.read = true; unread.value = Math.max(0, unread.value - 1); }
  } catch (err: any) { if (alive) itemError.value[item._id] = err?.response?.status === 409 ? "Esta atención cambió o ya tiene una valoración. Actualiza las notificaciones para revisarla." : "No pudimos guardar tu valoración. Selecciona las estrellas para volver a intentarlo."; }
  finally { if (alive) saving.value = ""; }
}
async function read(item: ClientNotice) {
  if (saving.value) return; serial++; loading.value = false; saving.value = item._id; itemError.value[item._id] = "";
  try { await API.read(item._id); if (alive && !item.read) { item.read = true; unread.value = Math.max(0, unread.value - 1); } }
  catch { if (alive) itemError.value[item._id] = "No pudimos marcarla como leída. Inténtalo de nuevo."; }
  finally { if (alive) saving.value = ""; }
}
function refreshWhenVisible() { if (!document.hidden) void load(); }
onMounted(() => { void load(); timer = setInterval(refreshWhenVisible, 30000); document.addEventListener("visibilitychange", refreshWhenVisible); window.addEventListener("focus", refreshWhenVisible); });
onBeforeUnmount(() => { alive = false; serial++; clearInterval(timer); document.removeEventListener("visibilitychange", refreshWhenVisible); window.removeEventListener("focus", refreshWhenVisible); dialog.value?.close(); });
</script>
