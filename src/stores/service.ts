// src/stores/service.ts

import ServiceAPI from "@/api/ServiceAPI";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface Service {
  _id: string;
  name: string;
  price: number;
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
  async function loadServices() {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await ServiceAPI.all();
      services.value = data;
    } catch (err: any) {
      services.value = [];
      error.value =
        err?.response?.data?.msg || "Error al cargar servicios";
    } finally {
      loading.value = false;
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

  return {
    services,
    loading,
    error,
    loadServices,
    createService,
    updateService,
    deleteService,
  };
});