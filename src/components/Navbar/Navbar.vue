<template>
  <header
    :class="[
      'z-50 w-full px-6 sm:px-10 lg:px-14 py-3 fixed top-0 left-0 right-0',
      showBackground
        ? 'bg-black/80 backdrop-blur-md border-b border-white/5'
        : 'bg-transparent border-transparent',
    ]"
  >
    <div class="w-full max-w-7xl mx-auto flex items-center justify-between">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-4 shrink-0">
        <div
          class="w-10 h-10 border border-white/30 flex items-center justify-center overflow-hidden"
        >
          <img
            src="/img/navbar/profile.png"
            alt="Logo"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="leading-none">
          <p class="text-[13px] tracking-[0.28em] font-medium text-white/90">
            STUDIO
          </p>
          <p class="text-[8px] tracking-[0.38em] text-[#ffb700] mt-1">
            SILHOUETTE
          </p>
        </div>
      </RouterLink>

      <!-- Menú -->
      <nav class="hidden lg:flex items-center gap-8">

        <!-- INICIO -->
        <RouterLink
          :to="{ name: 'Home' }"
          class="relative px-1 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
          :class="route.name === 'Home'
            ? 'text-white'
            : 'text-white/60 hover:text-white'"
        >
          Inicio

          <span
            class="absolute bottom-0 left-0 right-0 mx-auto h-px bg-[#ffb700] transition-all duration-300"
            :class="route.name === 'Home'
              ? 'opacity-100 scale-x-100'
              : 'opacity-0 scale-x-0'"
          />
        </RouterLink>

        <!-- SERVICIOS -->
        <RouterLink
          :to="{ name: 'Services' }"
          class="relative px-1 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
          :class="user.user
            ? 'text-white/60 hover:text-white'
            : 'text-white/20 pointer-events-none blur-[1px] select-none'"
        >
          Servicios

          <span
            v-if="user.user"
            class="absolute bottom-0 left-0 right-0 mx-auto h-px bg-[#ffb700] transition-all duration-300"
            :class="isServicesRoute
              ? 'opacity-100 scale-x-100'
              : 'opacity-0 scale-x-0'"
          />
        </RouterLink>

        <!-- NOSOTROS -->
        <RouterLink
          :to="{ name: 'History' }"
          class="relative px-1 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
          :class="user.user
            ? 'text-white/60 hover:text-white'
            : 'text-white/20 pointer-events-none blur-[1px] select-none'"
        >
          Nosotros

          <span
            v-if="user.user"
            class="absolute bottom-0 left-0 right-0 mx-auto h-px bg-[#ffb700] transition-all duration-300"
            :class="route.name === 'History'
              ? 'opacity-100 scale-x-100'
              : 'opacity-0 scale-x-0'"
          />
        </RouterLink>

        <!-- CONTACTO -->
        <RouterLink
          :to="{ name: 'Contact' }"
          class="relative px-1 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
          :class="user.user
            ? 'text-white/60 hover:text-white'
            : 'text-white/20 pointer-events-none blur-[1px] select-none'"
        >
          Contacto

          <span
            v-if="user.user"
            class="absolute bottom-0 left-0 right-0 mx-auto h-px bg-[#ffb700] transition-all duration-300"
            :class="route.name === 'Contact'
              ? 'opacity-100 scale-x-100'
              : 'opacity-0 scale-x-0'"
          />
        </RouterLink>

        <span
          class="text-[10px] text-white/20"
        >
          |
        </span>

        <!-- ADMINISTRACIÓN -->
        <RouterLink
          v-if="user.user?.admin"
          :to="{ name: 'Admin' }"
          class="relative px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.20em] text-white/60 transition-all duration-300"
          :class="isAdminRoute
            ? 'text-[#ffb700] border border-[#ffb700]/50'
            : 'hover:text-[#ffb700]'"
        >
          Administración
        </RouterLink>

        <!-- CERRAR SESIÓN -->
        <button
          v-if="user.user"
          @click="user.logout"
          class="px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.20em] text-white/45 hover:text-red-400 transition-colors duration-300"
        >
          Cerrar Sesión
        </button>

        <!-- INICIAR SESIÓN -->
        <RouterLink
          v-else
          :to="{ name: 'Login' }"
          class="text-[10px] font-extrabold uppercase tracking-[0.20em] text-white/60 hover:text-[#ffb700] transition-colors duration-300"
        >
          Iniciar Sesión
        </RouterLink>
      </nav>

      <!-- Reservar cita -->
      <button
        v-if="!user.isAdmin"
        @click="checkAuthAndShowWarning"
        class="flex items-center text-white gap-5 border border-[#ffb700]/60 px-5 py-3 text-[9px] uppercase tracking-[0.22em] hover:bg-[#ffb700] hover:text-black transition-all duration-300 shrink-0"
      >
        Reservar cita

        <span class="text-[#ffb700]">
          ↗
        </span>
      </button>

      <!-- Saludo -->
      <div
        v-if="user.isAuthenticated"
        class="flex items-center gap-3"
      >
        <span
          class="w-7 h-7 rounded-full border border-[#ffb700]/30 flex items-center justify-center text-[#ffb700] text-[10px]"
        >
          {{ user.getUserName?.charAt(0)?.toUpperCase() || "C" }}
        </span>

        <p class="text-white/40 text-xs font-light tracking-wide">
          Hola,
          <span class="text-white/80 font-medium">
            {{ user.getUserName || "Cliente" }}
          </span>
        </p>
      </div>
    </div>
  </header>

  <AuthWarning
    v-model:visible="showWarning"
    title="Reserva tu próxima cita"
    message="Para continuar con tu reserva, inicia sesión o crea una cuenta. Así podremos guardar tu cita, asignarte un horario y enviarte la confirmación."
    :steps="[
      'Inicia sesión si ya tienes una cuenta',
      'Crea una cuenta gratis si aún no tienes una',
      'Elige tus servicios, fecha y hora',
      'Confirma tu cita y recibe la confirmación por correo',
    ]"
    :buttons="['Iniciar sesión', 'Crear cuenta']"
    @button-click="handleWarningButton"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  RouterLink,
  useRoute,
  useRouter,
} from "vue-router";
import { useUserStore } from "@/stores/user";
import { useSceneStore } from "@/stores/navbar/currentScene";
import AuthWarning from "../UI/AuthWarning.vue";

const router = useRouter();
const route = useRoute();
const user = useUserStore();
const sceneStore = useSceneStore();
const showWarning = ref(false);

const isHome = computed(() => route.name === "Home");

const showBackground = computed(() => {
  return !isHome.value || sceneStore.currentScene === 4;
});

const isServicesRoute = computed(() =>
  [
    "Services",
    "Reservaciones",
    "My-appointments",
    "BarberSelect",
    "New-appointments",
    "New-Appointments-details",
  ].includes(route.name as string)
);

const isAdminRoute = computed(() =>
  ["Admin", "Admin-appointments"].includes(route.name as string)
);

const checkAuthAndShowWarning = () => {
  if (!user.user) {
    showWarning.value = true;
    return;
  }

  router.push({
    name: "Reservaciones",
  });
};

const handleWarningButton = (index: number) => {
  showWarning.value = false;

  if (index === 0) {
    router.push({
      name: "Login",
    });
    return;
  }

  if (index === 1) {
    router.push({
      name: "Register",
    });
  }
};
</script>

<style scoped>
</style>