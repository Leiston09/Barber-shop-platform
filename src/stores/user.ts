// src/stores/user.ts

import AuthAPI from "@/api/AuthAPI";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export type UserRole = "client" | "barber" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  admin: boolean;
  role: UserRole;
}

export const useUserStore = defineStore("user", () => {
  const router = useRouter();

  const user = ref<User | null>(null);
  const loading = ref(true);

  async function init() {
    try {
      const { data } = await AuthAPI.auth();
      user.value = data;
    } catch {
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  const getUserName = computed(() => user.value?.name || "");

  const isAuthenticated = computed(() => !!user.value);

  const isAdmin = computed(
    () => user.value?.role === "admin" || user.value?.admin === true,
  );

  const isBarber = computed(() => user.value?.role === "barber");

  const isClient = computed(() => user.value?.role === "client");

  function logout() {
    localStorage.removeItem("AUTH_TOKEN");
    user.value = null;

    router.push({
      name: "Login",
    });
  }

  return {
    user, // Guarda la información del usuario actualmente autenticado.
    loading, // Indica si el sistema todavía está comprobando/cargando la sesión del usuario.
    getUserName, // Obtiene el nombre del usuario para mostrarlo en la interfaz.
    isAuthenticated, // Comprueba si existe un usuario autenticado actualmente.
    isAdmin, // Comprueba si el usuario tiene el rol de administrador.
    isBarber, // Comprueba si el usuario tiene el rol de barbero.
    isClient, // Comprueba si el usuario tiene el rol de cliente.
    logout, // Cierra la sesión, elimina el token y devuelve al usuario al Login.
    init, // Comprueba el token y obtiene desde el backend los datos del usuario autenticado.
  };
});
