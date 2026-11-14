<template>
<section class="mt-6 rounded-2xl border border-white/15 bg-[#111] p-4 sm:p-6">
<h2 class="font-barber text-xl">Datos de la barbería</h2><p class="mt-2 text-xs leading-6 text-white/50">Se muestran en Contacto, Encuéntranos y el pie de página. Deja vacío lo que no quieras publicar.</p>
<form novalidate class="mt-5" @submit.prevent="save"><div class="grid gap-4 sm:grid-cols-2">
<label v-for="field in contactFields" :key="field.key" class="min-w-0 text-xs text-white/60">{{field.label}}<input v-model="draft[field.key]" :placeholder="placeholders[field.key]" :disabled="busy||!store.loaded" maxlength="500" class="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-black/20 px-3 text-sm text-white placeholder:text-white/30 focus:border-[#ffb700] focus:outline-none disabled:opacity-40" /></label>
</div><p class="mt-3 text-xs leading-5 text-white/40">Redes y mapas: enlaces completos con https://. Los teléfonos deben incluir el código del país.</p>
<p v-if="store.error" role="alert" class="mt-3 text-sm text-red-300">{{store.error}}</p>
<div class="mt-5 flex justify-end gap-3"><button type="button" @click="reload" :disabled="busy" class="min-h-11 rounded-lg border border-white/15 px-4 text-xs text-white/60">Actualizar</button><button :disabled="busy||!store.loaded" class="min-h-11 rounded-lg bg-[#ffb700] px-4 text-xs font-semibold text-black disabled:opacity-40">{{busy?'Guardando…':'Guardar datos'}}</button></div>
</form></section>
</template><script setup lang="ts">
import {onMounted,ref} from "vue";
import {onBeforeRouteLeave} from "vue-router";
import {contactFields,useBusinessStore} from "@/stores/business";
import api from "@/lib/axios";
import {toast} from "@/lib/notifications";
import {confirmDialog} from "@/lib/confirmDialog";
const placeholders: Record<string, string> = {
  "address": "Ej.: Av. Principal 123, junto al parque",
  "city": "Ej.: Pedro Carbo, Guayas",
  "phone": "Ej.: +593 99 123 4567",
  "whatsapp": "Ej.: +593 99 123 4567",
  "email": "Ej.: contacto@tubarberia.example",
  "mapsUrl": "https://maps.app.goo.gl/...",
  "instagram": "https://www.instagram.com/tu_barberia",
  "facebook": "https://www.facebook.com/tu_barberia",
  "tiktok": "https://www.tiktok.com/@tu_barberia",
  "website": "https://tubarberia.example"
};
const store=useBusinessStore(),draft=ref<Record<string,any>>({}),busy=ref(false),baseline=ref("");
async function reload(){if(baseline.value&&JSON.stringify(draft.value)!==baseline.value&&!await confirmDialog("¿Descartar los cambios de contacto?"))return;await store.load(true);draft.value={...store.data};baseline.value=JSON.stringify(draft.value);}
async function save(){if(busy.value||!store.loaded)return;busy.value=true;try{await api.put("/business",draft.value);await store.load(true);draft.value={...store.data};baseline.value=JSON.stringify(draft.value);toast.success("Datos de contacto guardados.");}catch(e:any){toast.error(e.response?.data?.msg||"No pudimos guardar los datos.");}finally{busy.value=false;}}
onBeforeRouteLeave(async()=>!busy.value&&(JSON.stringify(draft.value)===baseline.value||await confirmDialog("Hay cambios de contacto sin guardar. ¿Quieres salir?")));
onMounted(reload);
</script>