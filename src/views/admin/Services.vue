<template>
  <div class="min-w-0 text-white">
    <header class="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0 flex-1"><h1 class="font-barber text-2xl tracking-tight sm:text-3xl">Catálogo de servicios</h1><p class="mt-2 max-w-xl text-sm leading-6 text-white/55">Define qué puede reservar el cliente y presenta cada servicio con claridad.</p></div>
      <button type="button" :disabled="busy || loading || !!loadError" @click="requestIntent({ kind: 'create' })" class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#ffb700] px-4 text-sm font-medium text-black hover:bg-[#ffc433] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] disabled:opacity-35"><span aria-hidden="true" class="text-xl leading-none">+</span>Nuevo servicio</button>
    </header>

    <div class="mb-6 flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-white/60">{{ loading ? "Consultando el catálogo" : loadError ? "Catálogo sin consultar" : counts.published + (counts.published === 1 ? " servicio publicado" : " servicios publicados") }}<span v-if="!loading && !loadError" class="ml-3 text-xs text-white/35">{{ counts.paused }} pausados</span></p>
      <p class="flex items-center gap-2 text-xs text-white/50"><svg aria-hidden="true" class="size-4 text-[#ffb700]/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" stroke-linecap="round" /></svg>Turnos de 60 minutos · Hasta {{ settings.maxServicesPerAppointment }} servicios por cita</p>
    </div>

    <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
      <section ref="catalog" aria-labelledby="catalog-list-title" class="min-w-0 scroll-mt-44">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 id="catalog-list-title" class="text-base font-medium">Tu oferta</h2><button type="button" :disabled="busy || loading" @click="requestIntent({ kind: 'refresh' })" class="min-h-10 text-xs text-white/55 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-35">{{ loading ? "Actualizando…" : "Actualizar catálogo" }}</button></div>
        <label class="mb-4 flex flex-wrap items-center gap-3 text-xs text-white/50">Mostrar servicios
          <select v-model="state" @change="page = 1" class="min-h-11 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm text-white/75 focus:border-[#ffb700] focus:outline-none"><option value="published">Publicados</option><option value="paused">Pausados</option><option value="all">Todos</option></select>
        </label>
        <div class="mb-5 grid grid-cols-1 gap-3 min-[520px]:grid-cols-[minmax(0,1fr)_180px]">
          <div><label for="catalog-search" class="sr-only">Buscar por nombre o descripción</label><input id="catalog-search" v-model="search" type="search" @input="page = 1" placeholder="Buscar por nombre o descripción" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm placeholder:text-white/30 focus:border-[#ffb700] focus:outline-none" /></div>
          <div><label for="catalog-order" class="sr-only">Orden del catálogo</label><select id="catalog-order" v-model="order" @change="page = 1" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-xs text-white/65 focus:border-[#ffb700] focus:outline-none"><option value="name">Nombre A–Z</option><option value="price-low">Precio menor primero</option><option value="price-high">Precio mayor primero</option></select></div>
        </div>
        <div v-if="loading" role="status" class="grid gap-4 md:grid-cols-2"><span class="sr-only">Consultando los servicios</span><div v-for="n in 4" :key="n" aria-hidden="true" class="h-56 rounded-xl border border-white/10 bg-white/5 motion-safe:animate-pulse" /></div>
        <div v-else-if="loadError" role="alert" class="rounded-xl border border-amber-400/25 p-6"><h3 class="text-base">No pudimos consultar los servicios</h3><p class="mt-2 text-sm leading-6 text-white/55">{{ loadError }}</p><button type="button" @click="requestIntent({ kind: 'refresh' })" class="mt-4 min-h-11 text-sm text-[#ffb700]">Volver a consultar</button></div>
        <div v-else-if="!services.length" class="rounded-xl border border-white/10 p-7"><h3 class="font-barber text-xl">Prepara tu primer servicio</h3><p class="mt-3 max-w-md text-sm leading-6 text-white/50">Añade un nombre claro y su precio. Puedes publicarlo ahora o dejarlo pausado mientras completas su presentación.</p><button type="button" @click="requestIntent({ kind: 'create' })" class="mt-5 min-h-11 rounded-lg border border-[#ffb700]/35 px-4 text-sm text-[#ffb700]">Crear primer servicio</button></div>
        <div v-else-if="!filtered.length" class="rounded-xl border border-white/10 p-6"><h3 class="text-base">{{ search ? "No encontramos ese servicio" : state === "paused" ? "No hay servicios pausados" : "No hay servicios publicados" }}</h3><p class="mt-2 text-sm leading-6 text-white/50">{{ search ? "Prueba otro nombre o una palabra de su descripción." : "Cambia de vista para consultar el resto del catálogo." }}</p><button type="button" @click="clearSearch(); state = 'all'" class="mt-3 min-h-11 text-sm text-[#ffb700]">Ver todo el catálogo</button></div>
        <template v-else>
          <div class="grid items-stretch gap-4 md:grid-cols-2">
            <article v-for="service in visible" :key="service._id" class="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-neutral-900/35" :class="editing?._id === service._id ? 'border-[#ffb700]/50' : 'border-white/10'">
              <div class="flex items-start gap-3 p-4"><ServicePhoto :id="service._id" :name="service.name" :revision="service.photoUpdatedAt" class="size-20 shrink-0 rounded-lg border border-white/5" /><div class="min-w-0 flex-1"><p class="mb-2 flex items-center gap-1.5 text-[11px]" :class="service.active === false ? 'text-red-400' : 'text-green-400'"><span aria-hidden="true" class="size-1 rounded-full bg-current" />{{ service.active === false ? "Pausado" : "Publicado" }}</p><h3 class="break-words text-base font-medium leading-snug">{{ service.name }}</h3><p class="mt-2 text-xl font-medium tabular-nums text-[#ffb700]">{{ formatCurrency(service.price) }}</p></div></div>
              <p class="mx-4 mb-4 line-clamp-2 min-h-10 text-xs leading-5" :class="service.description ? 'text-white/55' : 'text-white/30'">{{ service.description || "Sin descripción adicional." }}</p>
              <div class="mx-4 mb-4 mt-auto flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/40"><span>{{ service.appointmentsCount ? service.appointmentsCount + (service.appointmentsCount === 1 ? " reserva registrada" : " reservas registradas") : "Aún sin reservas" }}</span><span v-if="service.futureAppointmentsCount" class="text-white/60">{{ service.futureAppointmentsCount }} próximas</span></div>
              <div class="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3"><button type="button" :disabled="busy || mode !== 'idle'" @click="togglePublished(service)" :class="service.active === false ? 'border-green-400/25 text-green-400 hover:bg-green-400/5' : 'border-red-400/25 text-red-300 hover:bg-red-400/5'" class="min-h-11 rounded-lg border px-3 text-xs">{{ service.active === false ? "Publicar" : "Pausar" }}</button><button type="button" :disabled="busy || preparingPhoto" @click="requestIntent({ kind: 'edit', service })" aria-controls="catalog-editor" class="min-h-11 flex-1 rounded-lg border border-white/20 px-3 text-sm text-white/80 hover:border-[#ffb700]/50 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-35">Editar servicio</button><button type="button" :disabled="busy || preparingPhoto" @click="requestIntent({ kind: 'duplicate', service })" class="min-h-11 rounded-lg px-2 text-xs text-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-35">Duplicar</button></div>
            </article>
          </div>
          <div class="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/45"><span>{{ filtered.length }} {{ filtered.length === 1 ? "servicio en esta vista" : "servicios en esta vista" }}</span><div v-if="pages > 1" class="flex items-center gap-3"><button type="button" :disabled="currentPage <= 1" @click="page = currentPage - 1" class="min-h-11 rounded-lg border border-white/10 px-3 disabled:opacity-30">Anterior</button><span>{{ currentPage }} de {{ pages }}</span><button type="button" :disabled="currentPage >= pages" @click="page = currentPage + 1" class="min-h-11 rounded-lg border border-white/10 px-3 disabled:opacity-30">Siguiente</button></div></div>
        </template>
      </section>

      <aside class="rounded-2xl border border-white/10 bg-[#111]">          <div  class="min-h-0 overflow-y-auto p-5">
            <div class="space-y-4 text-sm leading-6 text-white/60"><p><span class="text-white/75">Publicar</span> lo hace visible para nuevas reservas.</p><p><span class="text-white/75">Pausar</span> lo retira del catálogo del cliente y conserva las citas existentes.</p><p><span class="text-white/75">Fotografías</span>: puedes añadir una imagen opcional a cada servicio.</p></div>
          </div></aside>
      <dialog id="catalog-editor" ref="editor" aria-labelledby="service-editor-title" @cancel.prevent="requestIntent({kind: 'close'})" class="m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_1.5rem)] max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#111] p-0 text-white backdrop:bg-black/75">
        <section class="flex flex-col rounded-2xl border border-white/15 bg-[#111] overflow-hidden max-h-[calc(100dvh_-_2rem)]">
          <header v-if="mode !== 'idle'" class="relative pr-16 shrink-0 border-b border-white/10 px-5 py-4"><p class="mb-1 text-xs text-white/40">{{ mode === "create" ? "Preparar servicio" : "Edición del catálogo" }}</p><h2 id="service-editor-title" class="font-barber text-xl">{{ mode === "create" ? "Nuevo servicio" : "Editar servicio" }}</h2><button type="button" :disabled="busy || preparingPhoto" @click="requestIntent({ kind: 'close' })" aria-label="Cerrar edición" class="absolute right-4 top-4 flex size-10 items-center justify-center rounded-lg border border-white/15 text-xl text-white/65">×</button></header>

          <form v-if="mode !== 'idle'" class="flex min-h-0 flex-1 flex-col overflow-hidden" @submit.prevent="requestSave" novalidate>
            <div :inert="busy || preparingPhoto" class="min-h-0 max-h-[55dvh] flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5">
              <p v-if="error" role="alert" class="rounded-lg border border-red-400/25 p-3 text-sm leading-6 text-red-200">{{ error }}</p>
              <button v-if="stale" type="button" @click="reloadCurrent" class="min-h-11 text-sm text-[#ffb700]">Cargar datos actualizados</button>
              <div><label for="service-name" class="mb-2 block text-sm text-white/75">Nombre del servicio</label><input id="service-name" v-model="draft.name" type="text" maxlength="120" autocomplete="off" placeholder="Ej.: Corte clásico" :aria-invalid="!!errors.name" aria-describedby="service-name-feedback" class="min-h-11 w-full min-w-0 rounded-lg border border-white/20 bg-neutral-950 px-3 text-sm focus:border-[#ffb700] focus:outline-none" /><p id="service-name-feedback" v-if="errors.name || duplicate" class="mt-2 text-xs leading-5" :class="errors.name ? 'text-red-300' : 'text-amber-200'">{{ errors.name || "Ya existe otro servicio con este nombre. Usa uno que permita distinguirlos." }}</p></div>
              <div><label for="service-description" class="mb-2 flex justify-between gap-3 text-sm text-white/75">Descripción <span class="text-xs text-white/35">Opcional</span></label><textarea id="service-description" v-model="draft.description" rows="3" maxlength="300" :aria-invalid="!!errors.description" aria-describedby="service-description-feedback" placeholder="Explica qué incluye, sin repetir el nombre." class="w-full min-w-0 resize-y rounded-lg border border-white/20 bg-neutral-950 px-3 py-3 text-sm leading-6 placeholder:text-white/25 focus:border-[#ffb700] focus:outline-none" /><div id="service-description-feedback" class="mt-1 flex justify-between gap-3 text-[11px] leading-5 text-white/35"><span :class="{ 'text-red-300': errors.description }">{{ errors.description || "Visible al elegir servicios para reservar." }}</span><span class="shrink-0 tabular-nums">{{ draft.description.length }}/300</span></div></div>
              <div><label for="service-price" class="mb-2 block text-sm text-white/75">Precio por servicio</label><div class="flex items-center overflow-hidden rounded-lg border border-white/20 bg-neutral-950 focus-within:border-[#ffb700]"><span aria-hidden="true" class="pl-3 text-sm text-white/40">$</span><input id="service-price" v-model="draft.price" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" :aria-invalid="!!errors.price" aria-describedby="service-price-feedback" class="min-h-11 w-full min-w-0 bg-transparent px-3 text-base tabular-nums focus:outline-none" /><span class="pr-3 text-xs text-white/35">USD</span></div><p id="service-price-feedback" class="mt-2 text-xs leading-5" :class="errors.price ? 'text-red-300' : 'text-white/40'">{{ errors.price || "Se admite coma o punto y hasta dos decimales." }}</p><p v-if="priceChanged" class="mt-2 text-xs leading-5 text-amber-200">Precio anterior: {{ formatCurrency(editing?.price ?? 0) }}. El nuevo precio se aplicará a nuevas reservas; el importe guardado de las citas existentes se conserva.</p></div>
              <div class="rounded-xl border border-white/10 p-4"><label class="flex cursor-pointer items-start gap-3 text-sm text-white/80"><input v-model="draft.active" type="checkbox" class="mt-0.5 size-4 shrink-0 accent-[#ffb700]" /><span>Publicado para reservar<span class="mt-2 block text-xs leading-5 text-white/45">{{ draft.active ? "Los clientes podrán elegirlo en nuevas citas." : "Quedará pausado y no aparecerá para nuevas reservas." }}</span></span></label><details class="mt-3 text-xs text-white/55"><summary class="flex min-h-9 w-fit cursor-pointer items-center gap-2 text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700]"><svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></svg>¿Cómo funciona?</summary><p class="mt-2 leading-6">Publicado: el cliente puede elegirlo al reservar. Pausado: deja de ofrecerse para nuevas citas. Las citas existentes conservan el servicio y no se cancelan.</p></details></div>
              <section aria-labelledby="service-photo-title">
                <h3 id="service-photo-title" class="text-sm text-white/75">Fotografía <span class="ml-2 text-xs text-white/40">Opcional</span></h3>
                <div class="mt-3 flex flex-wrap items-center gap-4">
                  <ServicePhoto :id="editing?._id" :name="draft.name" :revision="editing?.photoUpdatedAt" :preview="photoDraft ? 'data:image/jpeg;base64,' + photoDraft : undefined" :hidden="photoDraft === null" class="size-24 shrink-0 rounded-xl border border-white/10" />
                  <div class="min-w-0 flex-1"><label class="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-white/20 px-3 text-xs text-white/80 focus-within:outline-2 focus-within:outline-[#ffb700]">{{ preparingPhoto ? 'Preparando…' : photoDraft || editing?.photoUpdatedAt ? 'Cambiar fotografía' : 'Subir fotografía' }}<input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" :disabled="busy || preparingPhoto" @change="choosePhoto" /></label><button v-if="photoDraft || editing?.photoUpdatedAt && photoDraft !== null" type="button" :disabled="preparingPhoto" @click="photoDraft = null" class="ml-3 min-h-11 text-xs text-red-300">Quitar</button><p class="mt-2 text-[11px] leading-5 text-white/40">JPG, PNG o WebP. Hasta 8 MB. Recorte central cuadrado.</p></div>
                </div>
              </section>
              <div><h3 class="mb-3 text-xs font-medium text-white/50">Vista previa de la presentación</h3><div class="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-950 p-3"><ServicePhoto :id="editing?._id" :name="draft.name" :revision="editing?.photoUpdatedAt" :preview="photoDraft ? 'data:image/jpeg;base64,' + photoDraft : undefined" :hidden="photoDraft === null" class="size-16 shrink-0 rounded-lg" /><div class="min-w-0"><p class="break-words text-sm text-white/80">{{ draft.name.trim() || "Nombre del servicio" }}</p><p class="mt-1 text-base tabular-nums text-[#ffb700]">{{ parseServicePrice(draft.price) === null ? "Precio pendiente" : formatCurrency(parseServicePrice(draft.price)!) }}</p></div></div><p class="mt-2 text-[11px] leading-5 text-white/35">La fotografía es opcional. Sin ella se conserva el espacio actual.</p></div>
              <div v-if="editing" class="space-y-2 text-xs leading-5 text-white/40"><p>{{ editing.appointmentsCount }} reservas asociadas · {{ editing.futureAppointmentsCount }} próximas</p><p>Última actualización: {{ shortDate(editing.updatedAt) }}</p><p v-if="editing.appointmentsCount">Para conservar el historial, este servicio se puede pausar y no eliminar.</p><button v-else type="button" @click="openConfirmation('delete')" class="min-h-11 text-xs text-red-300">Eliminar servicio sin reservas</button></div>
            </div>
            <footer class="shrink-0 rounded-b-2xl border-t border-white/10 bg-[#111] px-5 py-4 xl:static">
              <p class="mb-3 text-[11px] leading-5" :class="dirty ? 'text-[#ffb700]/80' : 'text-white/35'">{{ busy ? "Guardando, espera un momento…" : dirty ? "Hay cambios pendientes de guardar." : mode === "edit" ? "El servicio está actualizado." : "Completa los datos para añadirlo al catálogo." }}</p>
              <div class="flex gap-2"><button type="button" :disabled="busy || preparingPhoto" @click="requestIntent({kind: 'close'})" class="min-h-11 rounded-lg border border-white/20 px-3 text-sm text-white/70">Cerrar</button><button type="submit" :disabled="busy || stale || (mode === 'edit' && !dirty)" class="min-h-11 w-full rounded-lg bg-[#ffb700] px-3 text-sm font-medium text-black hover:bg-[#ffc433] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]">{{ busy ? "Guardando…" : mode === "create" ? draft.active ? "Crear y publicar servicio" : "Crear servicio pausado" : "Guardar cambios" }}</button></div>
            </footer>
          </form>
        </section>
      </dialog>
    </div>

    <dialog ref="confirmDialog" aria-labelledby="service-confirm-title" @cancel.prevent="closeConfirmation" @click.self="closeConfirmation" class="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#111] p-5 text-white shadow-2xl backdrop:bg-black/80 sm:p-6">
      <h2 id="service-confirm-title" class="font-barber text-xl">{{ confirmation === "discard" ? "Hay cambios sin guardar" : confirmation === "pause" ? "Pausar este servicio" : "Eliminar este servicio" }}</h2>
      <p v-if="confirmation === 'discard'" class="mt-3 text-sm leading-6 text-white/60">Puedes seguir editando o descartar los cambios para continuar.</p>
      <template v-else-if="confirmation === 'pause'"><p class="mt-3 break-words text-sm leading-6 text-white/70">{{ draft.name }}</p><p class="mt-3 text-sm leading-6 text-white/55">Dejará de aparecer para nuevas reservas. Se conservarán las {{ editing?.appointmentsCount ?? 0 }} citas asociadas y podrás publicarlo de nuevo cuando quieras.</p><p v-if="editing?.futureAppointmentsCount" class="mt-3 text-sm leading-6 text-amber-200">Sus {{ editing.futureAppointmentsCount }} próximas citas no se cancelarán.</p></template>
      <template v-else><p class="mt-3 break-words text-sm leading-6 text-white/65">Se eliminará {{ editing?.name }} de forma permanente. Esta acción solo se permite si no tiene citas asociadas.</p><label class="mt-4 block text-xs text-white/50">Escribe el nombre del servicio para confirmar<input v-model="deleteName" type="text" :disabled="busy || preparingPhoto" autocomplete="off" class="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-red-400/30 bg-neutral-950 px-3 text-sm text-white focus:border-red-300 focus:outline-none" /></label></template>
      <p v-if="error && confirmation !== 'discard'" role="alert" class="mt-4 rounded-lg border border-red-400/25 p-3 text-sm leading-6 text-red-200">{{ error }}</p>
      <div class="mt-6 flex flex-wrap gap-2"><button type="button" :disabled="busy || preparingPhoto" @click="closeConfirmation" class="min-h-11 flex-1 rounded-lg border border-white/20 px-3 text-sm text-white/65 disabled:opacity-35">{{ confirmation === "discard" ? "Seguir editando" : "Volver" }}</button><button type="button" :disabled="busy || confirmation === 'delete' && deleteName.trim() !== editing?.name || confirmation === 'pause' && stale" @click="executeConfirmation" class="min-h-11 flex-1 rounded-lg px-3 text-sm font-medium disabled:opacity-35" :class="confirmation === 'delete' ? 'bg-red-500 text-white' : 'bg-[#ffb700] text-black'">{{ busy ? "Procesando…" : confirmation === "discard" ? "Descartar cambios" : confirmation === "pause" ? "Pausar y guardar" : "Eliminar definitivamente" }}</button></div>
    </dialog>
  </div>
</template>
<script setup lang="ts">
import { confirmDialog as askConfirmation } from "@/lib/confirmDialog";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import ServicePhoto from "@/components/UI/ServicePhoto.vue";
import { prepareBarberPhoto as prepareServicePhoto } from "@/helpers/barberPhoto";
import { useSettingsStore } from "@/stores/settings";
import { serviceMessage } from "@/helpers/promotions";
import { useToast } from "@/lib/notifications";
import ServiceAPI from "@/api/ServiceAPI";
import { useServiceStore } from "@/stores/service";
import { filterCatalog, parseServicePrice, serviceDraftErrors, validCatalog, type CatalogService, type ServiceDraft } from "@/helpers/adminServices";
import { normalizeAgendaSearch } from "@/helpers/adminAgenda";
import { formatCurrency } from "@/helpers";
type Intent = { kind: "create" | "edit" | "duplicate" | "refresh" | "close"; service?: CatalogService };
type Confirmation = "discard" | "pause" | "delete" | null;
const settings = useSettingsStore(), photoDraft = ref<string | null | undefined>(undefined), preparingPhoto = ref(false);
const services = ref<CatalogService[]>([]), loading = ref(true), loadError = ref(""), busy = ref(false);
const search = ref(""), state = ref("published"), order = ref("name"), error = ref("");
const page = ref(1), pageSize = 8;
const toast = useToast();
const filtered = computed(() => filterCatalog(services.value, search.value, state.value, order.value));
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)));
const currentPage = computed(() => Math.min(page.value, pages.value));
const visible = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize));
const counts = computed(() => ({ all: services.value.length, published: services.value.filter(item => item.active !== false).length, paused: services.value.filter(item => item.active === false).length }));
const stateOptions = [{ value: "published", label: "Publicados" }, { value: "paused", label: "Pausados" }, { value: "all", label: "Todos" }];
const mode = ref<"idle" | "create" | "edit">("idle"), editing = ref<CatalogService | null>(null), baseline = ref("");
const emptyDraft = (): ServiceDraft => ({ name: "", price: "", description: "", active: true });
const draft = ref<ServiceDraft>(emptyDraft()), errors = ref<Record<string, string>>({}), stale = ref(false);
const snapshot = () => JSON.stringify({ ...draft.value, photo: photoDraft.value });
const dirty = computed(() => mode.value !== "idle" && snapshot() !== baseline.value);
const duplicate = computed(() => services.value.some(service => service._id !== editing.value?._id && normalizeAgendaSearch(service.name.trim()) === normalizeAgendaSearch(draft.value.name.trim())));
const priceChanged = computed(() => mode.value === "edit" && parseServicePrice(draft.value.price) !== null && parseServicePrice(draft.value.price) !== editing.value?.price);
const editor = ref<HTMLDialogElement>(), catalog = ref<HTMLElement>(), confirmDialog = ref<HTMLDialogElement>();
const confirmation = ref<Confirmation>(null), pendingIntent = ref<Intent | null>(null), deleteName = ref("");
let alive = true, request = 0;
const serviceStore = useServiceStore();
const shortDate = (value?: string) => {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? "Sin fecha disponible" : new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Guayaquil" }).format(date);
};
function resetEditor() { editor.value?.close(); photoDraft.value = undefined; preparingPhoto.value = false; mode.value = "idle"; editing.value = null; draft.value = emptyDraft(); baseline.value = ""; errors.value = {}; error.value = ""; stale.value = false; }
async function fetchCatalog() {
  const version = ++request; loading.value = true; loadError.value = "";
  try {
    const { data } = await ServiceAPI.adminAll();
    if (!alive || version !== request) return;
    if (!validCatalog(data)) throw new Error("Invalid catalog");
    services.value = data;
  } catch (err: any) { if (alive && version === request) { services.value = []; loadError.value = serviceMessage(err, "No pudimos cargar los servicios. Vuelve a intentarlo en un momento."); } }
  finally { if (alive && version === request) loading.value = false; }
}
async function applyIntent(intent: Intent) {
  resetEditor();
  if (intent.kind === "close") return;
  if (intent.kind === "refresh") { await fetchCatalog(); return; }
  const item = intent.service;
  if (intent.kind === "edit" && item) {
    mode.value = "edit"; editing.value = { ...item };
    draft.value = { name: item.name, price: item.price.toFixed(2), description: item.description || "", active: item.active !== false };
  } else {
    mode.value = "create";
    if (intent.kind === "duplicate" && item) {
      const stem = item.name.slice(0, 105);
      let name = stem + " (copia)", n = 2;
      while (services.value.some(service => normalizeAgendaSearch(service.name) === normalizeAgendaSearch(name))) name = stem + " (copia " + n++ + ")";
      draft.value = { name, price: item.price.toFixed(2), description: item.description || "", active: false };
    }
  }
  baseline.value = snapshot();
  if (intent.kind === "duplicate") baseline.value = "";
  await nextTick();
  if (!editor.value?.open) editor.value?.showModal();
  document.getElementById("service-name")?.focus({ preventScroll: true });
}
async function openConfirmation(value: Confirmation) {
  confirmation.value = value; deleteName.value = "";
  await nextTick(); if (!confirmDialog.value?.open) confirmDialog.value?.showModal();
}
function requestIntent(intent: Intent) {
  if (busy.value || preparingPhoto.value) return;
  if (dirty.value) { pendingIntent.value = intent; void openConfirmation("discard"); }
  else void applyIntent(intent);
}
function closeConfirmation() { if (busy.value) return; confirmDialog.value?.close(); confirmation.value = null; pendingIntent.value = null; }
async function reloadCurrent() {
  if (busy.value || !editing.value) return;
  if (dirty.value && !await askConfirmation("Se descartarán tus cambios para consultar la versión actual. ¿Continuar?")) return;
  const id = editing.value._id; await fetchCatalog();
  if (loadError.value) return;
  const service = services.value.find(service => service._id === id);
  if (service) await applyIntent({ kind: "edit", service }); else resetEditor();
}
async function togglePublished(service: CatalogService) {
  if (busy.value || mode.value !== "idle") return;
  busy.value = true;
  try {
    const { data } = await ServiceAPI.update(service._id, {
      name: service.name, price: service.price, description: service.description || "",
      active: service.active === false, version: service.__v,
    });
    const updated = { ...service, ...data.service };
    services.value = services.value.map(item => item._id === service._id ? updated : item);
    serviceStore.services = [];
    toast.success(updated.active === false ? "Servicio pausado." : "Servicio publicado.");
  } catch (err: any) {
    toast.error(serviceMessage(err, "No pudimos cambiar el estado. Actualiza el catálogo e inténtalo de nuevo."));
  } finally { busy.value = false; }
}
async function choosePhoto(event: Event) {
  const input = event.target as HTMLInputElement, file = input.files?.[0]; input.value = "";
  if (!file || busy.value || preparingPhoto.value) return;
  preparingPhoto.value = true; error.value = "";
  try { photoDraft.value = await prepareServicePhoto(file); }
  catch (err: any) { error.value = err?.message || "No pudimos preparar la fotografía."; }
  finally { preparingPhoto.value = false; }
}
async function requestSave() {
  if (busy.value || preparingPhoto.value || stale.value || mode.value === "idle") return;
  error.value = ""; errors.value = serviceDraftErrors(draft.value);
  if (Object.keys(errors.value).length) {
    await nextTick(); editor.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); return;
  }
  if (editing.value?.active !== false && mode.value === "edit" && !draft.value.active) { await openConfirmation("pause"); return; }
  await persist();
}
async function persist(): Promise<boolean> {
  if (busy.value || preparingPhoto.value || stale.value) return false;
  busy.value = true; error.value = "";
  try {
    const payload = { name: draft.value.name.trim(), price: parseServicePrice(draft.value.price)!, description: draft.value.description.trim(),
      active: draft.value.active, ...(photoDraft.value !== undefined ? { photo: photoDraft.value } : {}), ...(editing.value ? { version: editing.value.__v } : {}) };
    const { data } = editing.value ? await ServiceAPI.update(editing.value._id, payload) : await ServiceAPI.create(payload);
    const saved: CatalogService = { ...data.service, appointmentsCount: editing.value?.appointmentsCount ?? 0, futureAppointmentsCount: editing.value?.futureAppointmentsCount ?? 0 };
    if (!validCatalog([saved])) {
      resetEditor(); await fetchCatalog(); toast.info("El servicio se guardó. Consulta el catálogo actualizado antes de continuar."); return true;
    }
    services.value = [...services.value.filter(service => service._id !== saved._id), saved];
    editing.value = { ...saved }; mode.value = "edit";
    draft.value = { name: saved.name, price: saved.price.toFixed(2), description: saved.description || "", active: saved.active !== false };
    photoDraft.value = undefined;
    baseline.value = snapshot(); errors.value = {}; stale.value = false;
    state.value = saved.active === false ? "paused" : "published"; page.value = 1;
    toast.success(data.msg || "Servicio guardado."); serviceStore.services = []; return true;
  } catch (err: any) {
    stale.value = err?.response?.data?.code === "STALE_SERVICE";
    error.value = serviceMessage(err, "No pudimos guardar el servicio. Tus cambios siguen aquí; puedes volver a intentarlo."); return false;
  } finally { busy.value = false; }
}
async function executeConfirmation() {
  if (busy.value) return;
  if (confirmation.value === "discard") {
    const intent = pendingIntent.value; closeConfirmation(); if (intent) await applyIntent(intent); return;
  }
  if (confirmation.value === "pause") { if (await persist()) closeConfirmation(); return; }
  if (confirmation.value !== "delete" || !editing.value || editing.value.appointmentsCount > 0 || deleteName.value.trim() !== editing.value.name) return;
  busy.value = true; error.value = "";
  try {
    const { data } = await ServiceAPI.delete(editing.value._id);
    services.value = services.value.filter(service => service._id !== editing.value?._id);
    resetEditor(); toast.success(data.msg || "Servicio eliminado."); serviceStore.services = [];
    busy.value = false; closeConfirmation();
  } catch (err: any) { error.value = serviceMessage(err, "No pudimos eliminar el servicio. Actualiza el catálogo y vuelve a intentarlo."); }
  finally { busy.value = false; }
}
function clearSearch() { search.value = ""; page.value = 1; }
function beforeUnload(event: BeforeUnloadEvent) { if (dirty.value || busy.value) { event.preventDefault(); event.returnValue = ""; } }
onBeforeRouteLeave(async () => !preparingPhoto.value && !busy.value && (!dirty.value || await askConfirmation("Hay cambios sin guardar en el servicio. ¿Quieres descartarlos y salir?")));
onMounted(() => { void settings.load(); void fetchCatalog(); window.addEventListener("beforeunload", beforeUnload); });
onBeforeUnmount(() => { editor.value?.close(); alive = false; request++; confirmDialog.value?.close(); window.removeEventListener("beforeunload", beforeUnload); });
</script>
