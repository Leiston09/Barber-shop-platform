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

      <!-- Menú de laptop -->
      <Laptop />

      <!-- Reservar cita -->
      <button
        v-if="!user.isAdmin"
        @click="checkAuthAndShowWarning"
        class="flex items-center text-white gap-5 border border-[#ffb700]/60 px-5 py-3 text-[9px] uppercase tracking-[0.22em] hover:bg-[#ffb700] hover:text-black transition-all duration-300 shrink-0"
      >
        Reservar cita
        <span class="text-[#ffb700]">↗</span>
      </button>

      <!-- Saludo (laptop) -->
      <div v-if="user.isAuthenticated" class="hidden lg:flex items-center gap-3">
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

      <!-- Avatar simple (móvil) -->
      <div v-if="user.isAuthenticated" class="flex lg:hidden items-center">
        <span
          class="w-8 h-8 rounded-full border border-[#ffb700]/30 bg-[#ffb700]/5 flex items-center justify-center text-[#ffb700] text-[11px] font-barber"
        >
          {{ user.getUserName?.charAt(0)?.toUpperCase() || "C" }}
        </span>
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

  <!-- Menú de móvil (bottom nav flotante) -->
  <Mobile />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useSceneStore } from "@/stores/navbar/currentScene";
import AuthWarning from "../UI/AuthWarning.vue";
import Laptop from "./device/Laptop.vue";
import Mobile from "./device/Mobile.vue";

const router = useRouter();
const route = useRoute();
const user = useUserStore();
const sceneStore = useSceneStore();
const showWarning = ref(false);

const isHome = computed(() => route.name === "Home");

const showBackground = computed(() => {
  return !isHome.value || sceneStore.currentScene === 4;
});

const checkAuthAndShowWarning = () => {
  if (!user.user) {
    showWarning.value = true;
    return;
  }
  router.push({ name: "Reservaciones" });
};

const handleWarningButton = (index: number) => {
  showWarning.value = false;

  if (index === 0) {
    router.push({ name: "Login" });
    return;
  }
  if (index === 1) {
    router.push({ name: "Register" });
  }
};
</script>

<style scoped></style>