<template>
  <section class="min-w-0 text-white">
    <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h1 class="font-barber text-2xl sm:text-3xl">Imágenes del sitio</h1><p class="mt-2 text-sm text-white/55">Identidad, fotografías y galería del local.</p></div>
      <button type="button" :disabled="loading" @click="reload" class="min-h-10 rounded-lg border border-white/15 px-4 text-xs text-white/70 hover:bg-white/5 disabled:opacity-40">Actualizar</button>
    </header>
    <p v-if="media.error" role="alert" class="mb-5 rounded-xl border border-red-400/25 bg-red-400/5 p-4 text-sm text-red-200">{{ media.error }}</p>
    <nav aria-label="Ubicación de las imágenes" class="mb-6 flex flex-wrap gap-2">
      <button v-for="group in groups" :key="group.name" type="button" :aria-pressed="selected === group.name" @click="selected = group.name"
        class="min-h-10 rounded-lg border px-3 text-xs transition-colors" :class="selected === group.name ? 'border-[#ffb700]/30 bg-[#ffb700]/10 text-[#ffb700]' : 'border-white/10 text-white/60 hover:text-white'">{{ group.name }}</button>
    </nav>
    <div v-if="selected === 'Ubicación'" class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <div><h2 class="text-sm font-medium">Nuestro espacio</h2><p class="mt-1 text-xs leading-5 text-white/50">Las fotografías de esta galería se recorren debajo del mapa. El orden menor aparece primero.</p></div>
      <button type="button" @click="openEditor()" class="min-h-11 rounded-lg bg-[#ffb700] px-4 text-xs font-semibold text-black">Añadir fotografía</button>
    </div>
    <p v-if="loading && !media.loaded" class="py-12 text-center text-sm text-white/50">Consultando imágenes…</p>
    <div class="grid min-w-0 gap-4 md:grid-cols-2">
      <article v-for="item in filtered" :key="item._id" class="flex min-w-0 gap-4 rounded-2xl border border-white/10 bg-[#101010] p-4">
        <div class="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
          <img v-if="siteMediaUrl(item)" :src="siteMediaUrl(item)" :alt="item.alt" class="size-full object-contain" />
          <svg v-else aria-hidden="true" class="size-7 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></svg>
        </div>
        <div class="flex min-w-0 flex-1 flex-col items-start">
          <h2 class="break-words text-sm font-medium">{{ item.slot === 'gallery' ? item.title : item.label }}</h2>
          <p class="mt-1 text-xs leading-5 text-white/50">{{ item.placement }}</p>
          <span class="mt-2 text-[11px]" :class="item.hasPhoto ? 'text-green-400' : 'text-white/40'">{{ item.hasPhoto ? 'Imagen registrada' : 'Pendiente de imagen' }}<template v-if="item.slot === 'gallery'"> · Orden {{ item.order }}</template></span>
          <button type="button" @click="openEditor(item)" class="mt-3 rounded-md text-xs font-medium text-[#ffb700] hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700]">Editar imagen<span v-if="item.allowTitle"> y textos</span></button>
        </div>
      </article>
    </div>
    <dialog v-if="draft" ref="dialog" @cancel.prevent="closeEditor" @click="backdropClose" class="m-auto max-h-[90dvh] w-[calc(100%_-_1.5rem)] max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#101010] p-0 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm">
      <form novalidate class="flex max-h-[90dvh] flex-col" @submit.prevent="save">
        <header class="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
          <div><h2 class="font-barber text-xl">{{ editing ? editing.label : 'Añadir fotografía del local' }}</h2><p class="mt-1 text-xs leading-5 text-white/50">{{ editing?.placement || 'Nuestro espacio, debajo del mapa en Encuéntranos' }}</p></div>
          <button type="button" aria-label="Cerrar edición de imagen" :disabled="busy" @click="closeEditor" class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:bg-white/10 disabled:opacity-40"><svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        </header>
        <div class="min-h-0 space-y-5 overflow-y-auto p-4 sm:p-5">
          <div class="flex min-h-44 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30">
            <img v-if="preview" :src="preview" :alt="draft.alt" class="max-h-64 max-w-full object-contain" />
            <span v-else class="text-xs text-white/35">Sin imagen</span>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <label class="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-[#ffb700]/30 px-4 text-xs text-[#ffb700] focus-within:outline-2 focus-within:outline-[#ffb700]">{{ preview ? 'Cambiar imagen' : 'Seleccionar imagen' }}<input class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" :disabled="busy || preparing" @change="chooseFile" /></label>
            <button v-if="preview" type="button" :disabled="busy || preparing" @click="draft.photo = null" class="min-h-11 px-2 text-xs text-red-300 disabled:opacity-40">Quitar imagen</button>
            <span class="text-[11px] text-white/40">{{ preparing ? 'Preparando imagen…' : 'JPG, PNG o WebP · hasta 8 MB' }}</span>
          </div>
          <label v-if="!editing || editing.allowTitle" class="block text-xs text-white/60">Título<input v-model="draft.title" required maxlength="120" class="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-black/20 px-3 text-sm text-white focus:border-[#ffb700] focus:outline-none" /></label>
          <label v-if="!editing || editing.allowDescription" class="block text-xs text-white/60">Descripción<textarea v-model="draft.description" maxlength="600" rows="3" class="mt-2 w-full resize-y rounded-lg border border-white/15 bg-black/20 p-3 text-sm text-white focus:border-[#ffb700] focus:outline-none" /></label>
          <label class="block text-xs text-white/60">Texto alternativo<input v-model="draft.alt" required maxlength="200" class="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-black/20 px-3 text-sm text-white focus:border-[#ffb700] focus:outline-none" /><span class="mt-1.5 block text-[11px] text-white/35">Describe brevemente la imagen para quienes utilizan un lector de pantalla.</span></label>
          <label v-if="!editing || editing.slot === 'gallery'" class="block text-xs text-white/60">Orden en la galería<input v-model.number="draft.order" type="number" min="0" max="9999" step="1" required class="mt-2 min-h-11 w-28 rounded-lg border border-white/15 bg-black/20 px-3 text-sm text-white focus:border-[#ffb700] focus:outline-none" /></label>
        </div>
        <footer class="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-white/10 p-4 sm:p-5">
          <button v-if="editing?.slot === 'gallery'" type="button" :disabled="busy || preparing" @click="remove" class="mr-auto min-h-11 text-xs text-red-300 disabled:opacity-40">Eliminar fotografía</button>
          <button type="button" :disabled="busy" @click="closeEditor" class="min-h-11 rounded-lg border border-white/15 px-4 text-xs text-white/70 disabled:opacity-40">Cancelar</button>
          <button type="submit" :disabled="busy || preparing" class="min-h-11 rounded-lg bg-[#ffb700] px-5 text-xs font-semibold text-black disabled:opacity-40">{{ busy ? 'Guardando…' : 'Guardar cambios' }}</button>
        </footer>
      </form>
    </dialog>
  </section>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import api from "@/lib/axios";
import { useToast } from "@/lib/notifications";
import { confirmDialog } from "@/lib/confirmDialog";
import { prepareSiteImage } from "@/helpers/siteImage";
import { siteMediaUrl, useSiteMediaStore, type SiteMediaItem } from "@/stores/siteMedia";
const media = useSiteMediaStore(), toast = useToast();
const groups = [
  { name: "Identidad", slots: ["logo"] }, { name: "Inicio", slots: ["home-poster", "home-essence", "home-experience"] },
  { name: "Nosotros", slots: ["about"] }, { name: "Ubicación", slots: ["location-map", "gallery"] },
  { name: "Servicios", slots: ["service-barber", "service-tattoo"] }, { name: "Acceso", slots: ["auth-background"] },
];
const selected = ref("Identidad"), loading = ref(false), busy = ref(false), preparing = ref(false);
const editing = ref<SiteMediaItem>(), dialog = ref<HTMLDialogElement>();
type Draft = { title: string; description: string; alt: string; order: number; photo?: string | null };
const draft = ref<Draft>(), original = ref("");
const filtered = computed(() => media.items.filter(item => groups.find(group => group.name === selected.value)?.slots.includes(item.slot)));
const preview = computed(() => draft.value?.photo === null ? "" : draft.value?.photo ? "data:image/jpeg;base64," + draft.value.photo : siteMediaUrl(editing.value));
const dirty = computed(() => !!draft.value && JSON.stringify(draft.value) !== original.value);
async function reload() { loading.value = true; try { await media.load(true); } finally { loading.value = false; } }
async function openEditor(item?: SiteMediaItem) {
  editing.value = item;
  draft.value = { title: item?.title || "", description: item?.description || "", alt: item?.alt || "", order: item?.order ?? Math.max(-1, ...media.items.filter(i => i.slot === "gallery").map(i => i.order)) + 1 };
  original.value = JSON.stringify(draft.value);
  await nextTick(); dialog.value?.showModal();
}
async function closeEditor() {
  if (busy.value || preparing.value) return;
  if (dirty.value && !await confirmDialog("Hay cambios sin guardar. ¿Quieres descartarlos?")) return;
  dialog.value?.close(); draft.value = undefined;
}
function backdropClose(event: MouseEvent) { if (event.target === dialog.value) { const r = dialog.value.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeEditor(); } }
async function chooseFile(event: Event) {
  const input = event.target as HTMLInputElement, file = input.files?.[0];
  if (!file || !draft.value) return;
  preparing.value = true;
  try { draft.value.photo = await prepareSiteImage(file); }
  catch (error: any) { toast.error(error.message || "No pudimos preparar la imagen."); }
  finally { input.value = ""; preparing.value = false; }
}
async function save() {
  if (!draft.value || busy.value || preparing.value) return;
  busy.value = true;
  try {
    if (editing.value) await api.put("/site-media/" + editing.value._id, { ...draft.value, version: editing.value.version });
    else await api.post("/site-media", draft.value);
    dialog.value?.close(); draft.value = undefined;
    await reload(); toast.success("Imagen y contenido guardados.");
  } catch (error: any) { toast.error(error?.response?.data?.msg || "No pudimos guardar. Vuelve a intentarlo."); }
  finally { busy.value = false; }
}
async function remove() {
  if (!editing.value || busy.value || !await confirmDialog("¿Eliminar esta fotografía de la galería del local?")) return;
  busy.value = true;
  try {
    await api.delete("/site-media/" + editing.value._id, { params: { version: editing.value.version } });
    dialog.value?.close(); draft.value = undefined; await reload(); toast.success("Fotografía retirada de la galería.");
  } catch (error: any) { toast.error(error?.response?.data?.msg || "No pudimos eliminar la fotografía."); }
  finally { busy.value = false; }
}
onBeforeRouteLeave(async () => !busy.value && !preparing.value && (!dirty.value || await confirmDialog("Hay cambios sin guardar. ¿Quieres salir?")));
onMounted(reload);
</script>
