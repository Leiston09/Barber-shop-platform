// src/stores/user.ts

import AuthAPI from "@/api/AuthAPI";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAdminStore } from "./admin";
import { useBarberStore } from "./barber";
import { useMyAppointmentsStore } from "./myAppointments";
import { useAppointmentBookingStore } from "./appointmentCreator";
import { useRouter } from "vue-router";

export type UserRole = "client" | "barber" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  admin: boolean;
  isPrincipalAdmin?: boolean;
  role: UserRole;
}

export const useUserStore = defineStore("user", () => {
  const router = useRouter();

  const user = ref<User | null>(null);
  const loading = ref(true);
  const initialized = ref(false);

  async function init() {
    // Si ya tenemos un usuario cargado, no volver a pedirlo
    if (user.value) return;

    const token = localStorage.getItem("AUTH_TOKEN");

    if (!token) {
      user.value = null;
      loading.value = false;
      initialized.value = true;
      return;
    }

    try {
      const { data } = await AuthAPI.auth();
      user.value = data;
    } catch (error: any) {
      user.value = null;
      if (error?.response?.status === 401 || error?.response?.data?.blocked) {
        localStorage.removeItem("AUTH_TOKEN");
      }
    } finally {
      loading.value = false;
      initialized.value = true;
    }
  }

  const getUserName = computed(() => user.value?.name || "");
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(
    () => user.value?.role === "admin" || user.value?.admin === true,
  );
  const isPrincipalAdmin = computed(() => user.value?.role === "admin" && user.value?.isPrincipalAdmin === true);
  const isBarber = computed(() => user.value?.role === "barber");

  function logout() {
    localStorage.removeItem("AUTH_TOKEN");
    user.value = null;
    useAdminStore().clearPrivateData();
    useBarberStore().clearPrivateData();
    useMyAppointmentsStore().clearPrivateData();
    useAppointmentBookingStore().clearAppointmentData();

    router.push({ name: "Login" });
  }

  window.addEventListener("appsalon:session-invalid", logout);

  return {
    user,
    loading,
    initialized,
    getUserName,
    isAuthenticated,
    isAdmin,
    isBarber,
    isPrincipalAdmin,
    logout,
    init,
  };
});