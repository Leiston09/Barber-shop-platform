<template>
  <section aria-labelledby="promotion-manager-title" class="mt-5 rounded-2xl border border-white/15 bg-[#111] p-5">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div><h2 id="promotion-manager-title" class="font-barber text-xl text-white">Promociones</h2><p class="mt-2 text-xs leading-5 text-white/50">Descuentos con fecha de inicio y fin. Se aplican al confirmar la reserva.</p></div>
      <svg aria-hidden="true" class="mt-1 size-5 shrink-0 text-[#ffb700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m3 12 9-9h7a2 2 0 0 1 2 2v7l-9 9-9-9Z" stroke-linejoin="round" /><circle cx="16" cy="8" r="1.5" /></svg>
      <button type="button" :disabled="disabled || !eligible.length" @click="newPromotion" class="min-h-11 shrink-0 rounded-lg border border-[#ffb700]/35 px-4 text-sm text-[#ffb700] hover:bg-[#ffb700]/5 disabled:opacity-35">Nueva promoción</button>
    </header>
    <p v-if="error && !formOpen" role="alert" class="mt-4 rounded-lg border border-red-400/25 p-3 text-sm leading-6 text-red-200">{{ error }}</p>
    <aside class="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4"><h3 class="text-sm font-medium text-white/80">Cómo se aplican las promociones</h3><p class="mt-2 max-w-3xl text-xs leading-6 text-white/50">Una promoción habilitada ofrece el descuento durante las fechas indicadas, siempre que el servicio esté publicado. Al desactivarla, deja de ofrecerse para nuevas reservas. Las citas ya guardadas conservan su importe.</p></aside>
    <div>
      <p v-if="!offers.length" class="mt-5 text-sm leading-6 text-white/40">No hay promociones configuradas.</p>
      <ul v-else class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <li v-for="service in offers" :key="service._id" class="rounded-lg bg-white/[0.035] p-3">
          <div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="break-words text-sm text-white/85">{{ service.name }}</p><p class="mt-1 break-words text-xs text-white/45">{{ service.promotion?.title }}</p></div><span class="shrink-0 text-[11px]" :class="offerState(service) === 'Activa' ? 'text-green-400' : 'text-white/45'">{{ offerState(service) }}</span></div>
          <p class="mt-2 text-xs text-[#ffb700]">{{ service.promotion?.kind === 'percentage' ? service.promotion.value + ' % de descuento' : formatCurrency(service.promotion?.value ?? 0) + ' precio especial' }}</p>
          <p class="mt-2 text-[11px] leading-5 text-white/40">{{ promotionDate(service.promotion!.startsAt) }} — {{ promotionDate(service.promotion!.endsAt) }}</p>
          <button type="button" :disabled="disabled || busy" @click="openService(service)" class="mt-2 min-h-10 text-xs text-white/75 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-35">Gestionar promoción</button>
        </li>
      </ul>

      <p v-if="!disabled && !eligible.length" class="mt-2 text-xs leading-5 text-white/40">Añade un servicio con precio mayor que cero para preparar una promoción.</p>
    </div>
    <dialog ref="editorDialog" aria-labelledby="promotion-editor-title" @cancel.prevent="closeForm" @click.self="closeForm" class="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%_-_1.5rem)] max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#111] p-0 text-white shadow-2xl backdrop:bg-black/75 open:flex open:flex-col">
      <header class="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6"><h2 id="promotion-editor-title" class="font-barber text-2xl font-normal">{{ selected?.promotion ? 'Editar promoción' : 'Nueva promoción' }}</h2><button type="button" :disabled="busy" @click="closeForm" aria-label="Cerrar promoción" class="flex size-10 items-center justify-center rounded-lg border border-white/15 text-xl text-white/60 disabled:opacity-40">×</button></header>
      <p v-if="error" role="alert" class="mx-4 mt-4 shrink-0 rounded-lg border border-red-400/25 p-3 text-sm text-red-200 sm:mx-6">{{ error }}</p>
    <form class="flex min-h-0 max-h-[calc(100dvh_-_8rem)] flex-1 flex-col overflow-hidden" @submit.prevent="save" novalidate>
      <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain"><fieldset :disabled="busy || disabled" class="min-w-0 space-y-3 px-4 py-4 disabled:opacity-50 sm:px-6">
        <div><label for="promotion-service" class="mb-1.5 block text-xs text-white/65">Servicio</label><select id="promotion-service" :value="serviceId" @change="changeService" class="min-h-11 sm:min-h-10 w-full min-w-0 rounded-lg border border-white/20 bg-neutral-950 px-3 text-sm text-white focus:border-[#ffb700] focus:outline-none"><option value="">Elige un servicio</option><option v-for="service in eligible" :key="service._id" :value="service._id">{{ service.name }}{{ service.active === false ? ' (pausado)' : '' }}</option></select></div>
        <template v-if="selected">
          <p class="text-xs text-white/50">Precio normal: <span class="text-white/80">{{ formatCurrency(selected.price) }}</span></p>
          <div><label for="promotion-title" class="mb-1.5 block text-xs text-white/65">Nombre de la promoción</label><input id="promotion-title" v-model="draft.title" type="text" maxlength="80" placeholder="Ej.: Semana del corte clásico" class="min-h-11 sm:min-h-10 w-full rounded-lg border border-white/20 bg-neutral-950 px-3 text-sm text-white placeholder:text-white/25 focus:border-[#ffb700] focus:outline-none" /></div>
          <div class="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
            <div><label for="promotion-kind" class="mb-1.5 block text-xs text-white/65">Tipo de descuento</label><select id="promotion-kind" v-model="draft.kind" class="min-h-11 sm:min-h-10 w-full min-w-0 rounded-lg border border-white/20 bg-neutral-950 px-2 text-sm text-white"><option value="percentage">Porcentaje (%)</option><option value="price">Precio especial ($)</option></select></div>
            <div><label for="promotion-value" class="mb-1.5 block text-xs text-white/65">{{ draft.kind === 'percentage' ? 'Porcentaje' : 'Precio final (USD)' }}</label><input id="promotion-value" v-model="draft.value" type="text" inputmode="decimal" :placeholder="draft.kind === 'percentage' ? 'Ej.: 20' : 'Ej.: 10,00'" class="min-h-11 sm:min-h-10 w-full rounded-lg border border-white/20 bg-neutral-950 px-3 text-sm text-white focus:border-[#ffb700] focus:outline-none" /></div>
          </div>
          <div class="grid gap-3 sm:grid-cols-2"><div class="min-w-0"><label for="promotion-start" class="mb-1.5 block text-xs text-white/65">Empieza</label><DateHourPicker id="promotion-start" v-model="draft.startsAt"   /></div>
          <div class="min-w-0"><label for="promotion-end" class="mb-1.5 block text-xs text-white/65">Termina</label><DateHourPicker id="promotion-end" v-model="draft.endsAt"   /><p class="mt-2 text-[11px] leading-5 text-white/40">Hora de Ecuador. Fuera de este periodo no se muestra ni se aplica el descuento.</p></div></div>
          <label class="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 px-3 text-sm text-white/75"><span>Promoción habilitada</span><span class="relative inline-flex h-6 w-10 shrink-0 items-center"><input v-model="draft.enabled" type="checkbox" class="peer sr-only" /><span aria-hidden="true" class="absolute inset-0 rounded-full bg-white/15 transition-colors peer-checked:bg-[#ffb700] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#ffb700] motion-reduce:transition-none"></span><span aria-hidden="true" class="pointer-events-none absolute left-1 size-4 rounded-full bg-white/80 transition-transform peer-checked:translate-x-4 peer-checked:bg-black motion-reduce:transition-none"></span></span></label>
          <div v-if="preview !== null" class="rounded-xl border border-[#ffb700]/15 bg-[#ffb700]/[0.035] p-4"><p class="text-xs text-white/45">Precio que verá el cliente durante la promoción</p><p class="mt-2 flex flex-wrap items-baseline gap-3"><span class="text-2xl font-medium tabular-nums text-[#ffb700]">{{ formatCurrency(preview) }}</span><del class="text-sm text-white/35">{{ formatCurrency(selected.price) }}</del></p></div>
          <p v-if="selected.active === false" class="text-xs leading-5 text-amber-200">El servicio está pausado. La promoción se verá cuando lo publiques, dentro del periodo indicado.</p>
          <p class="text-[11px] leading-5 text-white/40">Cada servicio puede tener una promoción activa o programada. Las citas ya guardadas mantienen su importe.</p>
        </template>
      </fieldset></div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-white/10 bg-[#111] px-4 py-4 sm:px-6"><button type="button" :disabled="busy" @click="closeForm" class="min-h-11 flex-1 rounded-lg border border-white/15 px-3 text-sm text-white/60 disabled:opacity-35">Volver</button><button type="submit" :disabled="busy || disabled || !selected || stale" class="min-h-11 flex-1 rounded-lg bg-[#ffb700] px-3 text-sm font-medium text-black disabled:opacity-35">{{ busy ? 'Guardando…' : 'Guardar promoción' }}</button>      <button v-if="stale" type="button" :disabled="busy" @click="emit('refresh')" class="min-h-11 rounded-lg px-3 text-xs text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700]">Actualizar catálogo</button>
      <button v-if="selected?.promotion" type="button" :disabled="busy || disabled || stale" @click="remove" class="min-h-11 rounded-lg border border-red-400/20 px-3 text-xs text-red-300 hover:bg-red-400/5 focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-35">Retirar promoción</button>
</div>
    </form>
    </dialog>
  </section>
</template>
<script setup lang="ts">
import DateHourPicker from "@/components/UI/DateHourPicker.vue";
import { confirmDialog } from "@/lib/confirmDialog";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useToast } from "@/lib/notifications";
import ServiceAPI from "@/api/ServiceAPI";
import { formatCurrency } from "@/helpers";
import { parseServicePrice, type CatalogService } from "@/helpers/adminServices";
import { fromPromotionInput, toPromotionInput, promotionDate, serviceMessage, type Promotion } from "@/helpers/promotions";
const toast = useToast();
const props = defineProps<{ services: CatalogService[]; disabled: boolean }>();
const emit = defineEmits<{ updated: [service: CatalogService]; busy: [value: boolean]; refresh: [] }>();
const editorDialog = ref<HTMLDialogElement>();
const formOpen = ref(false), serviceId = ref(""), busy = ref(false), error = ref(""), baseline = ref(""), version = ref(0), stale = ref(false);
watch(() => formOpen.value, async opened => { await nextTick(); if (opened && !editorDialog.value?.open) editorDialog.value?.showModal(); else if (!opened) editorDialog.value?.close(); });
const empty = () => ({ title: "", kind: "percentage" as "percentage" | "price", value: "", startsAt: toPromotionInput(new Date(new Date().setMinutes(0,0,0))), endsAt: toPromotionInput(new Date(new Date(Date.now() + 86400000).setMinutes(0,0,0))), enabled: true });
const draft = ref(empty()), clock = ref(Date.now());
const offers = computed(() => props.services.filter(service => service.promotion));
const eligible = computed(() => props.services.filter(service => service.price > 0));
const selected = computed(() => props.services.find(service => service._id === serviceId.value));
const snapshot = () => JSON.stringify({ service: serviceId.value, ...draft.value });
const dirty = computed(() => formOpen.value && snapshot() !== baseline.value);
const preview = computed(() => {
  const base = selected.value?.price, value = parseServicePrice(draft.value.value);
  if (base === undefined || value === null || draft.value.kind === "percentage" && (value <= 0 || value > 100) || draft.value.kind === "price" && value >= base) return null;
  return draft.value.kind === "percentage" ? Math.round(Math.round(base * 100) * (100 - value) / 100) / 100 : value;
});
function offerState(service: CatalogService) {
  const promotion = service.promotion;
  if (!promotion?.enabled) return "Desactivada";
  if (Date.parse(promotion.endsAt) <= clock.value) return "Finalizada";
  if (service.active === false) return "Servicio pausado";
  return Date.parse(promotion.startsAt) > clock.value ? "Programada" : "Activa";
}
async function canLeave() { return !busy.value && (!dirty.value || await confirmDialog("Hay cambios sin guardar en la promoción. ¿Quieres descartarlos?")); }
function discard() { formOpen.value = false; baseline.value = ""; error.value = ""; stale.value = false; }
function fill(service?: CatalogService) {
  serviceId.value = service?._id || ""; version.value = service?.__v ?? 0; stale.value = false;
  draft.value = service?.promotion ? { ...service.promotion, value: String(service.promotion.value), startsAt: toPromotionInput(service.promotion.startsAt), endsAt: toPromotionInput(service.promotion.endsAt) } : empty();
  baseline.value = snapshot(); error.value = "";  formOpen.value = true;
}
async function newPromotion() { if (await canLeave()) fill(eligible.value.find(service => !service.promotion)); }
async function openService(service: CatalogService) { if (await canLeave()) fill(service); }
async function closeForm() { if (await canLeave()) discard(); }
async function changeService(event: Event) {
  const input = event.target as HTMLSelectElement;
  if (!await canLeave()) { input.value = serviceId.value; return; }
  fill(props.services.find(service => service._id === input.value));
}
async function persist(promotion: Promotion | null) {
  if (busy.value || !selected.value || props.disabled || stale.value) return;
  busy.value = true; error.value = ""; 
  const previous = selected.value;
  try {
    const { data } = await ServiceAPI.updatePromotion(previous._id, promotion, version.value);
    if (!data?.service || data.service._id !== previous._id || typeof data.service.price !== "number") throw new Error("Unexpected response");
    const service = { ...previous, ...data.service } as CatalogService;
    version.value = service.__v ?? version.value + 1; emit("updated", service);
    toast.success(promotion ? "Promoción guardada. Se mostrará durante el periodo indicado." : "Promoción retirada. Se utiliza el precio normal.");
    formOpen.value = false; baseline.value = "";
  } catch (err: any) {
    stale.value = err?.response?.data?.code === "STALE_SERVICE";
    error.value = serviceMessage(err, "No pudimos guardar la promoción. Tus cambios siguen aquí.");
  } finally { busy.value = false; }
}
async function save() {
  error.value = "";
  const startsAt = fromPromotionInput(draft.value.startsAt), endsAt = fromPromotionInput(draft.value.endsAt);
  if (![draft.value.startsAt, draft.value.endsAt].every(value => /T\d{2}:00$/.test(value))) { error.value = "Selecciona horas completas para el inicio y el final."; return; }
  const value = parseServicePrice(draft.value.value);
  if (!selected.value || !draft.value.title.trim() || draft.value.title.trim().length > 80) { error.value = "Elige un servicio y escribe el nombre de la promoción."; return; }
  if (preview.value === null || value === null) { error.value = draft.value.kind === "percentage" ? "Indica un descuento mayor que 0 y de hasta 100 %." : "El precio especial debe ser menor que el precio normal."; return; }
  if (!startsAt || !endsAt || Date.parse(endsAt) <= Date.parse(startsAt)) { error.value = "Revisa el periodo: la fecha final debe ser posterior al inicio."; return; }
  if (preview.value >= selected.value.price) { error.value = "El descuento debe reducir el precio al menos un centavo."; return; }
  if (draft.value.enabled && Date.parse(endsAt) <= Date.now()) { error.value = "La promoción debe terminar en una fecha futura para poder utilizarse."; return; }
  await persist({ title: draft.value.title.trim(), kind: draft.value.kind, value, startsAt, endsAt, enabled: draft.value.enabled });
}
async function remove() {
  if (!selected.value || busy.value) return;
  if (await confirmDialog("¿Retirar esta promoción? Las reservas guardadas conservarán su importe.")) void persist(null);
}
function beforeUnload(event: BeforeUnloadEvent) { if (dirty.value || busy.value) { event.preventDefault(); event.returnValue = ""; } }
let timer: ReturnType<typeof setInterval> | undefined;
watch(busy, value => emit("busy", value));
watch(() => props.services, () => {
  if (stale.value && selected.value) { error.value = "El catálogo se actualizó. Vuelve a abrir la promoción para revisar sus datos."; discard(); }
});
onMounted(() => { timer = setInterval(() => { clock.value = Date.now(); }, 1000); window.addEventListener("beforeunload", beforeUnload); });
onBeforeUnmount(() => { editorDialog.value?.close(); if (timer) clearInterval(timer); window.removeEventListener("beforeunload", beforeUnload); });
defineExpose({ canLeave, discard, dirty });
</script>