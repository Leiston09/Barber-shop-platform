<template>
  <section class="min-w-0 text-white">
    <header class="mb-6"><h1 class="font-barber text-2xl sm:text-3xl">Promociones</h1><p class="mt-2 text-sm leading-6 text-white/55">Gestiona descuentos y precios especiales con fechas de inicio y finalización.</p></header>
    <p v-if="loading" role="status" class="py-6 text-sm text-white/55">Consultando servicios y promociones…</p>
    <div v-else-if="error" role="alert" class="rounded-xl border border-red-400/25 p-5"><p class="text-sm text-red-300">{{ error }}</p><button type="button" @click="load" class="mt-3 min-h-11 text-sm text-[#ffb700]">Volver a consultar</button></div>
    <AdminServicePromotions v-else ref="manager" :services="services" :disabled="loading" @updated="updated" @busy="busy = $event" @refresh="load" />
  </section>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import ServiceAPI from "@/api/ServiceAPI";
import AdminServicePromotions from "@/components/admin/AdminServicePromotions.vue";
import { validCatalog, type CatalogService } from "@/helpers/adminServices";
import { useServiceStore } from "@/stores/service";
const services = ref<CatalogService[]>([]), manager = ref<InstanceType<typeof AdminServicePromotions>>(), loading = ref(true), busy = ref(false), error = ref("");
let alive = true;
async function load() {
  if (busy.value) return;
  loading.value = true; error.value = "";
  try { const { data } = await ServiceAPI.adminAll(); if (!validCatalog(data)) throw new Error(); if (alive) services.value = data; }
  catch { if (alive) error.value = "No pudimos consultar las promociones. Vuelve a intentarlo."; }
  finally { if (alive) loading.value = false; }
}
function updated(service: CatalogService) { services.value = services.value.map(item => item._id === service._id ? service : item); useServiceStore().services = []; }
onBeforeRouteLeave(async () => !busy.value && await manager.value?.canLeave() !== false);
onMounted(load); onBeforeUnmount(() => { alive = false; });
</script>
