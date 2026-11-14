<template>
  <section class="mx-auto min-w-0 max-w-3xl text-white">
    <header class="mb-6"><h1 class="font-barber text-2xl sm:text-3xl">Configuración general</h1><p class="mt-2 text-sm leading-6 text-white/55">Condiciones para las nuevas reservas del salón.</p></header>
    <form class="rounded-2xl border border-white/15 bg-[#111] p-4 sm:p-6" @submit.prevent="save">
      <h2 class="text-base font-medium">Servicios por cita</h2>
      <p class="mt-2 max-w-xl text-sm leading-6 text-white/55">Define cuántos servicios pueden elegirse en una reserva. Este límite también se aplica al administrador.</p>
      <label for="service-limit" class="mt-5 block text-sm text-white/75">Máximo de servicios</label>
      <input id="service-limit" v-model="maximum" type="number" min="1" step="1" required :disabled="busy || settings.loading || !settings.loaded"
        class="mt-2 min-h-11 w-full max-w-40 rounded-lg border border-white/20 bg-neutral-950 px-3 tabular-nums focus:border-[#ffb700] focus:outline-none disabled:opacity-40" />
      <p class="mt-3 text-xs leading-6 text-white/45">Valor inicial: 2. Mínimo: 1. Cada cita sigue ocupando 60 minutos.</p>
      <p class="mt-3 rounded-lg bg-white/[0.03] p-3 text-xs leading-6 text-white/60">Las citas ya registradas conservan sus servicios aunque reduzcas el límite. No se eliminarán servicios ni se cancelarán reservas.</p>
      <p v-if="error || settings.error" role="alert" class="mt-4 text-sm text-red-300">{{ error || settings.error }}</p>
      <div class="mt-6 flex flex-wrap items-center justify-end gap-3">
        <button type="button" :disabled="busy || settings.loading" @click="reload" class="min-h-11 rounded-lg border border-white/15 px-4 text-sm text-white/65 disabled:opacity-40">Actualizar</button>
        <button type="submit" :disabled="busy || settings.loading || !settings.loaded || Number(maximum) === settings.maxServicesPerAppointment" class="min-h-11 rounded-lg bg-[#ffb700] px-5 text-sm font-semibold text-black disabled:opacity-40">{{ busy ? 'Guardando…' : 'Guardar configuración' }}</button>
      </div>
    </form>
    <BusinessSettings />
  </section>
</template>
<script setup lang="ts">
import BusinessSettings from "@/components/admin/BusinessSettings.vue";
import { confirmDialog } from "@/lib/confirmDialog";
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useSettingsStore } from "@/stores/settings";
import api from "@/lib/axios";
import { useToast } from "@/lib/notifications";
const settings = useSettingsStore(), toast = useToast(), maximum = ref<string | number>(2), busy = ref(false), error = ref("");
async function reload() { error.value = ""; if (await settings.load()) maximum.value = settings.maxServicesPerAppointment; }
async function save() {
  const value = Number(maximum.value);
  if (busy.value || !settings.loaded) return;
  if (!Number.isSafeInteger(value) || value < 1) { error.value = "Escribe un número entero, como mínimo 1."; return; }
  busy.value = true; error.value = "";
  try {
    const { data } = await api.put("/settings", { maxServicesPerAppointment: value, version: settings.version });
    settings.maxServicesPerAppointment = data.maxServicesPerAppointment; settings.version = data.version;
    maximum.value = data.maxServicesPerAppointment; toast.success("Configuración guardada.");
  } catch (err: any) {
    error.value = err?.response?.data?.msg || "No pudimos guardar. Conservamos tu selección para que puedas reintentarlo.";
  } finally { busy.value = false; }
}
onBeforeRouteLeave(async () => !busy.value && (Number(maximum.value) === settings.maxServicesPerAppointment || await confirmDialog("Hay cambios sin guardar. ¿Quieres salir?")));
onMounted(reload);
</script>
