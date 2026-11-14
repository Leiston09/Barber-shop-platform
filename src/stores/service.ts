// src/stores/service.ts

import { currentServicePrice, serviceMessage, type Promotion } from "@/helpers/promotions";
import ServiceAPI from "@/api/ServiceAPI";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface Service {
  _id: string;
  name: string;
  price: number;
  description?: string;
  photoUpdatedAt?: string | null;
  active?: boolean;
  basePrice?: number;
  promotion?: Promotion | null;
  createdAt?: string;
  updatedAt?: string;
}

export const useServiceStore = defineStore("service", () => {
  const services = ref<Service[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /* =========================================================
     LISTAR
     ========================================================= */
  async function loadServices(silent = false) {
    if (!silent) loading.value = true;
    error.value = null;

    try {
      const { data } = await ServiceAPI.all();
      if (!Array.isArray(data) || data.some(item => !item || typeof item._id !== "string" || typeof item.name !== "string" || typeof item.price !== "number" || !Number.isFinite(item.price) || item.price < 0)) throw new Error("Invalid catalog");
      services.value = data.map((item: Service) => {
        const existing = services.value.find(service => service._id === item._id);
        if (!existing) return item;
        delete existing.basePrice; delete existing.promotion;
        Object.assign(existing, item);
        return existing;
      });
    } catch (err: any) {
      if (silent) return;
      services.value = [];
      error.value = serviceMessage(err, "No pudimos cargar los servicios. Vuelve a intentarlo en un momento.");
    } finally {
      if (!silent) loading.value = false;
    }
  }

  /* =========================================================
     CREAR
     ========================================================= */
  async function createService(
    payload: { name: string; price: number },
    toast: any,
  ) {
    try {
      const { data } = await ServiceAPI.create(payload);
      await loadServices();
      toast.open({ message: data.msg, type: "success" });
      return true;
    } catch (err: any) {
      toast.open({
        message:
          err?.response?.data?.msg || "Error al crear el servicio",
        type: "error",
      });
      return false;
    }
  }

  /* =========================================================
     ACTUALIZAR
     ========================================================= */
  async function updateService(
    id: string,
    payload: { name: string; price: number },
    toast: any,
  ) {
    try {
      const { data } = await ServiceAPI.update(id, payload);
      await loadServices();
      toast.open({ message: data.msg, type: "success" });
      return true;
    } catch (err: any) {
      toast.open({
        message:
          err?.response?.data?.msg || "Error al actualizar el servicio",
        type: "error",
      });
      return false;
    }
  }

  /* =========================================================
     ELIMINAR
     ========================================================= */
  async function deleteService(id: string, toast: any) {
    try {
      const { data } = await ServiceAPI.delete(id);
      await loadServices();
      toast.open({ message: data.msg, type: "warning" });
      return true;
    } catch (err: any) {
      toast.open({
        message:
          err?.response?.data?.msg || "Error al eliminar el servicio",
        type: "error",
      });
      return false;
    }
  }

  let observers = 0;
  let liveTimer: ReturnType<typeof setInterval> | undefined;
  let lastSync = 0;
  function observeCatalog() {
    observers++;
    if (observers === 1) {
      void loadServices();
      lastSync = Date.now();
      liveTimer = setInterval(() => {
        for (const service of services.value) {
          if (service.promotion && currentServicePrice(service) !== service.price) {
            service.price = currentServicePrice(service); delete service.basePrice; delete service.promotion;
          }
        }
        if (Date.now() - lastSync >= 15000 && document.visibilityState === "visible") {
          lastSync = Date.now(); void loadServices(true);
        }
      }, 1000);
    }
    let stopped = false;
    return () => { if (stopped) return; stopped = true; observers = Math.max(0, observers - 1); if (!observers && liveTimer) { clearInterval(liveTimer); liveTimer = undefined; } };
  }
  return {
    observeCatalog,
    services,
    loading,
    error,
    loadServices,
    createService,
    updateService,
    deleteService,
  };
});