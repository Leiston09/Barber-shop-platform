<template>
  <section class="min-w-0 text-white">
    <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><p class="mb-2 text-xs text-[#ffb700]">Administración principal</p><h1 class="font-barber text-2xl sm:text-3xl">Base de datos</h1><p class="mt-2 text-sm text-white/50">Colecciones, registros e importaciones del salón.</p></div>
      <button type="button" :disabled="busy || loading" @click="refresh" class="min-h-11 rounded-lg border border-white/15 px-4 text-xs text-white/70 hover:bg-white/5 disabled:opacity-40">Actualizar</button>
    </header>
    <p v-if="error" role="alert" class="mb-5 rounded-xl border border-red-400/25 bg-red-400/5 p-4 text-sm text-red-200">{{ error }}</p>
    <div class="grid min-w-0 items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside class="min-w-0 rounded-2xl border border-white/10 bg-[#101010]">
        <div class="border-b border-white/10 p-4"><p class="break-all text-sm font-medium">{{ database || 'Colecciones' }}</p><input v-model="search" type="search" aria-label="Buscar colección" placeholder="Buscar colección" class="mt-3 min-h-10 w-full min-w-0 rounded-lg border border-white/15 bg-black/25 px-3 text-xs placeholder:text-white/30 focus:border-[#ffb700] focus:outline-none" /></div>
        <p v-if="loading" role="status" class="p-4 text-xs text-white/40">Consultando colecciones…</p>
        <nav v-else aria-label="Colecciones de la base de datos" class="max-h-72 space-y-1 overflow-y-auto p-2 lg:max-h-[55dvh]">
          <button v-for="item in filtered" :key="item.name" type="button" :disabled="busy" :aria-pressed="selected === item.name" @click="selectCollection(item.name)"
            class="flex min-h-14 w-full items-center justify-between gap-2 rounded-lg border p-3 text-left transition-colors disabled:opacity-40" :class="selected === item.name ? 'border-[#ffb700]/25 bg-[#ffb700]/10' : 'border-transparent hover:bg-white/5'">
            <span class="min-w-0"><span class="block break-all text-xs" :class="selected === item.name ? 'text-[#ffb700]' : 'text-white/75'">{{ item.name }}</span><span class="mt-1 block text-[10px] text-white/35">{{ item.readOnly ? 'Historial protegido' : item.managed ? 'De la aplicación' : 'Colección independiente' }}</span></span>
            <span class="shrink-0 text-xs tabular-nums text-white/40">{{ item.count }}</span>
          </button>
        </nav>
        <form class="border-t border-white/10 p-4" @submit.prevent="newCollection">
          <label for="new-collection" class="text-xs text-white/55">Nueva colección</label>
          <input id="new-collection" v-model="newName" :disabled="busy" maxlength="80" placeholder="Nombre de la colección" class="mt-2 min-h-10 w-full min-w-0 rounded-lg border border-white/15 bg-black/25 px-3 text-xs placeholder:text-white/25 focus:border-[#ffb700] focus:outline-none" />
          <button :disabled="busy || !newName.trim()" class="mt-2 min-h-10 text-xs text-[#ffb700] disabled:opacity-30">Preparar importación</button>
        </form>
      </aside>

      <div class="min-w-0">
        <section v-if="current" class="overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e0e]">
          <header class="border-b border-white/10 p-4 sm:p-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0"><h2 class="break-all text-base font-medium">{{ current.name }}</h2><p class="mt-1 text-xs text-white/40">{{ result.count }} registros<span v-if="current.model"> · {{ current.model }}</span></p></div>
              <span class="rounded-md border border-white/10 px-2 py-1 text-[10px] text-white/45">{{ current.managed ? 'Colección de la aplicación' : 'Colección independiente' }}</span>
            </div>
            <div v-if="!current.readOnly" class="mt-4 flex flex-wrap gap-2">
              <button type="button" :disabled="busy" @click="template" class="min-h-10 rounded-lg border border-white/15 px-3 text-xs text-white/70 disabled:opacity-40">Plantilla Excel</button>
              <button type="button" :disabled="busy" @click="openImport" class="min-h-10 rounded-lg border border-[#ffb700]/35 bg-[#ffb700]/5 px-3 text-xs text-[#ffb700] disabled:opacity-40">Importar Excel</button>
              <button v-if="current.count" type="button" :disabled="busy" @click="prepare('clear')" class="min-h-10 rounded-lg border border-red-400/20 px-3 text-xs text-red-300 disabled:opacity-40">Vaciar registros</button>
              <button v-if="current.canDrop && current.exists" type="button" :disabled="busy" @click="prepare('drop')" class="min-h-10 rounded-lg border border-red-400/30 bg-red-400/5 px-3 text-xs text-red-300 disabled:opacity-40">Eliminar colección</button>
            </div>
            <p v-if="current.protectsPrincipal" class="mt-3 text-xs leading-5 text-[#ffb700]/70">La cuenta principal se conserva al vaciar usuarios y no se puede eliminar.</p>
            <p v-else-if="current.managed" class="mt-3 text-xs leading-5 text-white/35">Vaciar conserva la colección y sus índices. Las referencias de otras colecciones no se eliminan automáticamente.</p>
          </header>
          <div v-if="fetching" role="status" class="p-10 text-center text-sm text-white/45">Consultando registros…</div>
          <p v-else-if="!result.items.length" class="p-10 text-center text-sm text-white/40">Esta colección no tiene registros.</p>
          <div v-else class="divide-y divide-white/10">
            <article v-for="item in result.items" :key="item.id" class="min-w-0 p-4 sm:p-5">
              <header class="flex items-start justify-between gap-3">
                <div class="min-w-0"><p class="break-all font-mono text-xs text-white/65">{{ item.id }}</p><p v-if="item.protected" class="mt-1 text-[10px] text-[#ffb700]">Administrador principal protegido</p></div>
                <button v-if="!current.readOnly" type="button" :disabled="busy || item.protected" @click="prepare('delete', item.id)" :aria-label="'Eliminar registro ' + item.id" class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-red-400/15 text-red-300/70 hover:border-red-400/40 hover:bg-red-400/5 disabled:cursor-not-allowed disabled:opacity-20">
                  <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" /></svg>
                </button>
              </header>
              <details class="mt-2" :open="result.items.length === 1"><summary class="w-fit cursor-pointer py-2 text-xs text-[#ffb700]/75 focus-visible:outline-2 focus-visible:outline-[#ffb700]">Ver documento</summary><pre class="mt-2 max-h-96 overflow-auto rounded-lg border border-white/[0.06] bg-black/25 p-3 font-mono text-[11px] leading-5 text-white/65">{{ pretty(item.document) }}</pre></details>
            </article>
          </div>
          <footer class="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
            <p class="text-xs text-white/40">Página {{ result.page }} de {{ result.pages }}</p>
            <div class="flex gap-2"><button type="button" :disabled="busy || fetching || result.page <= 1" @click="fetchPage(result.page - 1)" class="min-h-10 rounded-lg border border-white/15 px-3 text-xs text-white/60 disabled:opacity-25">Anterior</button><button type="button" :disabled="busy || fetching || result.page >= result.pages" @click="fetchPage(result.page + 1)" class="min-h-10 rounded-lg border border-white/15 px-3 text-xs text-white/60 disabled:opacity-25">Siguiente</button></div>
          </footer>
        </section>
        <p v-else class="rounded-2xl border border-white/10 p-10 text-center text-sm text-white/40">Selecciona una colección para consultar sus documentos.</p>
        <p class="mt-4 text-[11px] leading-5 text-white/30">Vista técnica. Contraseñas, tokens y archivos binarios se mantienen ocultos. Los textos extensos pueden aparecer recortados.</p>
      </div>
    </div>

    <dialog v-if="mode" ref="dialog" @cancel.prevent="close" class="m-auto max-h-[90dvh] w-[calc(100%_-_1.5rem)] max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#111] p-0 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm">
      <form novalidate class="flex max-h-[90dvh] flex-col" @submit.prevent="submit">
        <header class="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
          <div class="min-w-0"><h2 class="font-barber text-xl">{{ mode === 'import' ? 'Importar Excel' : mode === 'drop' ? 'Eliminar colección' : mode === 'clear' ? 'Vaciar registros' : 'Eliminar registro' }}</h2><p class="mt-1 break-all text-xs text-white/45">{{ selected }}</p></div>
          <button type="button" :disabled="busy" @click="close" aria-label="Cerrar operación de base de datos" class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white/60 disabled:opacity-40"><svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        </header>
        <div class="min-h-0 space-y-4 overflow-y-auto p-4 sm:p-5">
          <template v-if="mode === 'import'">
            <p class="text-sm leading-6 text-white/55">Añade registros nuevos mediante la primera hoja de un archivo .xlsx. No se sobrescriben registros existentes.</p>
            <label class="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#ffb700]/30 bg-[#ffb700]/[0.025] p-4 text-center text-sm text-[#ffb700] focus-within:outline-2 focus-within:outline-[#ffb700]"><span>{{ fileName || 'Seleccionar archivo Excel' }}</span><span class="text-[11px] text-white/40">Hasta 2 MB · 200 registros · sin fórmulas ni macros</span><input class="sr-only" :disabled="busy" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="chooseFile" /></label>
            <p class="text-xs leading-5 text-white/45">Usa los encabezados de la plantilla. Las listas y objetos se escriben como JSON en sus celdas. Las fechas de citas usan YYYY-MM-DD y las horas HH:00. Para colecciones independientes, utiliza una columna <span class="text-white/70">documento</span> con un objeto JSON por fila.</p>
            <button type="button" :disabled="busy" @click="template" class="min-h-9 text-xs text-[#ffb700]">Descargar plantilla de esta colección</button>
            <div v-if="preview" class="rounded-xl border border-white/10 p-4">
              <p class="text-sm text-white/80">{{ preview.valid }} filas válidas · {{ preview.errorCount }} errores</p>
              <ul v-if="preview.errorCount" class="mt-3 max-h-40 space-y-2 overflow-y-auto text-xs text-red-200"><li v-for="(issue,index) in preview.errors" :key="index">Fila {{ issue.row }}: {{ issue.message }}</li></ul>
              <details v-if="preview.sample.length" class="mt-3"><summary class="cursor-pointer text-xs text-[#ffb700]">Ver muestra de registros</summary><pre class="mt-3 max-h-60 overflow-auto rounded-lg bg-black/25 p-3 text-[11px] leading-5 text-white/60">{{ pretty(preview.sample) }}</pre></details>
              <p class="mt-3 text-[11px] leading-5 text-white/40">Se comprueban formatos, referencias y duplicados. Si aparece un conflicto durante el guardado, se informará cuántos registros se guardaron; no se promete una operación atómica entre varias filas.</p>
            </div>
          </template>
          <div v-else class="rounded-xl border border-red-400/20 bg-red-400/5 p-4">
            <p class="text-sm text-red-200">{{ plan.count }} registros afectados.</p>
            <p class="mt-2 text-xs leading-6 text-white/60">{{ plan.warning }}</p>
            <p v-if="plan.preservesPrincipal" class="mt-2 text-xs text-[#ffb700]">Se conservará la cuenta del administrador principal.</p>
          </div>
          <template v-if="token">
            <label class="block text-xs text-white/60">Escribe <strong class="select-all font-medium text-white">{{ expectedConfirmation }}</strong><input v-model="confirmation" :disabled="busy" autocomplete="off" spellcheck="false" class="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-black/25 px-3 text-sm text-white focus:border-[#ffb700] focus:outline-none" /></label>
            <label class="block text-xs text-white/60">Tu contraseña<input v-model="password" :disabled="busy" type="password" autocomplete="current-password" class="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-black/25 px-3 text-sm text-white focus:border-[#ffb700] focus:outline-none" /></label>
            <p class="text-[11px] text-white/35">La confirmación caduca en cinco minutos y solo puede usarse una vez.</p>
          </template>
          <p v-if="operationError" role="alert" class="rounded-lg border border-red-400/20 p-3 text-xs leading-5 text-red-200">{{ operationError }}</p>
        </div>
        <footer class="flex shrink-0 flex-wrap justify-end gap-3 border-t border-white/10 p-4 sm:p-5">
          <button type="button" :disabled="busy" @click="close" class="min-h-11 rounded-lg border border-white/15 px-4 text-xs text-white/65 disabled:opacity-40">Cancelar</button>
          <button v-if="!token" type="submit" :disabled="busy || mode === 'import' && !fileData" class="min-h-11 rounded-lg bg-[#ffb700] px-4 text-xs font-semibold text-black disabled:opacity-40">{{ busy ? 'Consultando…' : mode === 'import' ? 'Validar y ver vista previa' : 'Revisar de nuevo' }}</button>
          <button v-else type="submit" :disabled="busy || confirmation !== expectedConfirmation || !password" class="min-h-11 rounded-lg px-4 text-xs font-semibold disabled:opacity-30" :class="mode === 'import' ? 'bg-[#ffb700] text-black' : 'bg-red-400 text-black'">{{ busy ? 'Procesando…' : mode === 'import' ? 'Importar registros' : 'Confirmar eliminación' }}</button>
        </footer>
      </form>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import api from "@/lib/axios";
import { toast } from "@/lib/notifications";
interface Collection { name: string; count: number; exists: boolean; managed: boolean; model: string | null; readOnly: boolean; canDrop: boolean; protectsPrincipal: boolean }
interface RecordItem { id: string; document: Record<string, unknown>; protected: boolean }
interface Preview { total: number; valid: number; errors: {row: number; message: string}[]; errorCount: number; sample: unknown[]; token: string | null }
const collections = ref<Collection[]>([]), database = ref(""), selected = ref(""), search = ref(""), newName = ref("");
const loading = ref(false), fetching = ref(false), busy = ref(false), error = ref("");
const result = ref<{count: number; page: number; pages: number; items: RecordItem[]}>({count:0,page:1,pages:1,items:[]});
const dialog = ref<HTMLDialogElement>(), mode = ref<"" | "import" | "delete" | "clear" | "drop">("");
const token = ref(""), confirmation = ref(""), password = ref(""), operationError = ref(""), targetId = ref("");
const plan = ref({ count:0, confirmation:"", warning:"", preservesPrincipal:false });
const preview = ref<Preview>(), fileName = ref(""), fileData = ref("");
const current = computed(() => collections.value.find(item => item.name === selected.value));
const filtered = computed(() => collections.value.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase())));
const expectedConfirmation = computed(() => mode.value === "import" ? "IMPORTAR " + selected.value : plan.value.confirmation);
const endpoint = () => "/database-admin/collections/" + encodeURIComponent(selected.value);
const pretty = (value: unknown) => JSON.stringify(value, null, 2);
let sequence = 0, alive = true;
const message = (err: any) => err?.response?.data?.msg || "No pudimos confirmar el resultado. Actualiza la colección antes de repetir la operación.";
async function refresh() {
  if (busy.value) return;
  loading.value = true; error.value = "";
  try {
    const {data} = await api.get("/database-admin/collections"); if (!alive) return;
    collections.value = data.collections; database.value = data.database;
    if (!collections.value.some(item => item.name === selected.value)) selected.value = collections.value[0]?.name || "";
    if (selected.value) await fetchPage(1); else result.value = {count:0,page:1,pages:1,items:[]};
  } catch (err) { if (alive) error.value = message(err); }
  finally { if (alive) loading.value = false; }
}
async function fetchPage(page: number) {
  const request = ++sequence, name = selected.value; fetching.value = true; error.value = "";
  try { const {data} = await api.get(endpoint(), {params:{page}}); if (alive && request === sequence && name === selected.value) result.value = data; }
  catch (err) { if (alive && request === sequence) error.value = message(err); }
  finally { if (alive && request === sequence) fetching.value = false; }
}
async function selectCollection(name: string) { if (busy.value) return; selected.value = name; result.value = {count:0,page:1,pages:1,items:[]}; await fetchPage(1); }
function newCollection() {
  const name = newName.value.trim();
  if (!/^[a-zA-Z0-9_][a-zA-Z0-9_.-]{0,79}$/.test(name) || name.startsWith("system.") || name === "_database_admin_events") { toast.error("Elige un nombre de colección válido."); return; }
  if (!collections.value.some(item => item.name === name)) collections.value.push({name,count:0,exists:false,managed:false,model:null,readOnly:false,canDrop:true,protectsPrincipal:false});
  selected.value = name; result.value = {count:0,page:1,pages:1,items:[]}; newName.value = ""; openImport();
}
async function template() {
  try {
    const {data} = await api.get(endpoint() + "/template", {responseType:"blob"});
    const url = URL.createObjectURL(data); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "plantilla-" + selected.value + ".xlsx"; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch { toast.error("No pudimos descargar la plantilla."); }
}
async function show() { await nextTick(); dialog.value?.showModal(); }
function resetModal() { token.value = ""; password.value = ""; confirmation.value = ""; operationError.value = ""; preview.value = undefined; fileData.value = ""; fileName.value = ""; targetId.value = ""; }
async function openImport() { if (busy.value) return; resetModal(); mode.value = "import"; await show(); }
function close() { if (busy.value) return; dialog.value?.close(); mode.value = ""; resetModal(); }
async function prepare(action: "delete" | "clear" | "drop", id = "") {
  if (busy.value) return;
  busy.value = true;
  try {
    const {data} = await api.post(endpoint() + "/prepare", {action,id});
    resetModal(); plan.value = data; token.value = data.token; targetId.value = id; mode.value = action; await show();
  } catch (err) { toast.error(message(err)); }
  finally { busy.value = false; }
}
async function chooseFile(event: Event) {
  const input = event.target as HTMLInputElement, file = input.files?.[0]; input.value = "";
  token.value = ""; preview.value = undefined; operationError.value = ""; confirmation.value = ""; password.value = ""; fileData.value = ""; fileName.value = "";
  if (!file) return;
  if (!/\.xlsx$/i.test(file.name) || file.size > 2 * 1024 * 1024 || !file.size) { operationError.value = "Selecciona un archivo .xlsx de hasta 2 MB."; return; }
  busy.value = true;
  try {
    fileData.value = await new Promise<string>((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] || ""); reader.onerror = reject; reader.readAsDataURL(file); });
    fileName.value = file.name;
  } catch { operationError.value = "No pudimos leer el archivo."; }
  finally { busy.value = false; }
}
async function submit() {
  if (busy.value) return;
  busy.value = true; operationError.value = "";
  let completed = false;
  try {
    if (!token.value) {
      if (mode.value === "import") {
        const {data} = await api.post(endpoint() + "/import-preview", {file:fileData.value}, {timeout:60000});
        preview.value = data; token.value = data.token || "";
      } else {
        const {data} = await api.post(endpoint() + "/prepare", {action:mode.value,id:targetId.value});
        plan.value = data; token.value = data.token;
      }
      return;
    }
    if (confirmation.value !== expectedConfirmation.value || !password.value) return;
    const path = mode.value === "import" ? "/import-execute" : "/execute";
    const {data} = await api.post(endpoint() + path, {action:mode.value,id:targetId.value,token:token.value,password:password.value,
      confirmation:confirmation.value,...(mode.value === "import" ? {file:fileData.value} : {})}, {timeout:120000});
    if (data.complete === false) toast.warning(data.msg); else toast.success(data.msg);
    completed = true;
  } catch (err: any) { operationError.value = message(err); if (err.response?.status === 409) token.value = ""; }
  finally {
    password.value = ""; busy.value = false;
    if (completed) { close(); await refresh(); }
  }
}
onBeforeRouteLeave(() => !busy.value);
onBeforeUnmount(() => { alive = false; sequence++; dialog.value?.close(); password.value = ""; fileData.value = ""; });
onMounted(refresh);
</script>
