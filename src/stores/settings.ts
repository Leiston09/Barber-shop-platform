import { ref } from "vue";
import { defineStore } from "pinia";
import api from "@/lib/axios";

export const useSettingsStore = defineStore("settings", () => {
  const maxServicesPerAppointment = ref(2), version = ref(-1), loading = ref(false), loaded = ref(false), error = ref("");
  let pending: Promise<boolean> | undefined;
  async function load() {
    if (pending) return pending;
    pending = (async () => {
      loading.value = true; error.value = "";
      try {
        const { data } = await api.get("/settings");
        if (!Number.isSafeInteger(data?.maxServicesPerAppointment) || data.maxServicesPerAppointment < 1 || !Number.isInteger(data.version)) throw new Error();
        maxServicesPerAppointment.value = data.maxServicesPerAppointment; version.value = data.version; loaded.value = true;
        return true;
      } catch {
        error.value = "No pudimos consultar las condiciones de reserva. Vuelve a intentarlo.";
        return false;
      } finally { loading.value = false; }
    })();
    try { return await pending; } finally { pending = undefined; }
  }
  return { maxServicesPerAppointment, version, loading, loaded, error, load };
});
