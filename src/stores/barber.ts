// src/stores/barber.ts

import BarberAPI from "@/api/barberAPI";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface Barber {
  _id: string;
  name: string;
  email: string;
  role: "barber";
  photoUpdatedAt?: string;
}

export interface BarberClientAppointment {
  _id: string;
  date: string;
  time: string;
  services: { _id: string; name: string; price: number }[];
  total: number;
}

export interface BarberClient {
  _id: string;
  name: string;
  role: "client" | "barber" | "admin";
  appointmentsCount: number;
  totalSpent: number;
  lastAppointment: string | null;
  appointments: BarberClientAppointment[];
}

export const useBarberStore = defineStore("barber", () => {
  const barbers = ref<Barber[]>([]);

  const loading = ref(false);

  const error = ref("");

  // Clientes del barbero
  const myClients = ref<BarberClient[]>([]);
  const loadingClients = ref(false);
  const clientsError = ref("");

  async function getBarbers() {
    loading.value = true;
    error.value = "";

    try {
      const { data } = await BarberAPI.getBarbers();

      barbers.value = data;
    } catch (err: any) {
      barbers.value = [];

      error.value =
        err?.response?.data?.msg ||
        "Error al obtener los barberos";
    } finally {
      loading.value = false;
    }
  }

  async function getMyClients() {
    loadingClients.value = true;
    clientsError.value = "";

    try {
      const { data } = await BarberAPI.getMyClients();
      myClients.value = data;
    } catch (err: any) {
      myClients.value = [];
      clientsError.value =
        err?.response?.data?.msg || "Error al obtener los clientes";
    } finally {
      loadingClients.value = false;
    }
  }

  function clearPrivateData() {
    myClients.value = [];
    clientsError.value = "";
  }

  return {
    clearPrivateData,
    barbers,
    loading,
    error,
    getBarbers,

    // Clientes del barbero
    myClients,
    loadingClients,
    clientsError,
    getMyClients,
  };
});