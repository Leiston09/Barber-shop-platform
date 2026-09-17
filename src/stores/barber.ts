// src/stores/barber.ts

import BarberAPI from "@/api/barberAPI";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface Barber {
  _id: string;
  name: string;
  email: string;
  role: "barber";
}

export interface ScheduleBreak {
  startTime: string;
  endTime: string;
}

export interface BarberScheduleDay {
  day: number;
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
  breaks: ScheduleBreak[];
}

export interface BlockedDate {
  date: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface BarberSchedule {
  _id: string;
  barber: string;
  schedule: BarberScheduleDay[];
  blockedDates: BlockedDate[];
}

export const useBarberStore = defineStore("barber", () => {
  const barbers = ref<Barber[]>([]);
  const schedule = ref<BarberSchedule | null>(null);

  const loading = ref(false);
  const loadingSchedule = ref(false);

  const error = ref("");
  const scheduleError = ref("");

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

  async function getSchedule(barberId: string) {
    if (!barberId) {
      schedule.value = null;
      return;
    }

    loadingSchedule.value = true;
    scheduleError.value = "";

    try {
      const { data } =
        await BarberAPI.getSchedule(barberId);

      schedule.value = data;
    } catch (err: any) {
      schedule.value = null;

      scheduleError.value =
        err?.response?.data?.msg ||
        "Error al obtener el horario";
    } finally {
      loadingSchedule.value = false;
    }
  }

  async function createSchedule(
    barberId: string,
    data: any
  ) {
    const response =
      await BarberAPI.createSchedule(
        barberId,
        data
      );

    schedule.value = response.data;

    return response;
  }

  async function updateSchedule(
    barberId: string,
    data: any
  ) {
    const response =
      await BarberAPI.updateSchedule(
        barberId,
        data
      );

    schedule.value = response.data;

    return response;
  }

  async function deleteSchedule(
    barberId: string
  ) {
    const response =
      await BarberAPI.deleteSchedule(
        barberId
      );

    schedule.value = null;

    return response;
  }

  function clearSchedule() {
    schedule.value = null;
    scheduleError.value = "";
  }

  return {
    barbers,
    schedule,
    loading,
    loadingSchedule,
    error,
    scheduleError,
    getBarbers,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    clearSchedule,
  };
});