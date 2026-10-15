<template>
  <header
    :class="[
      'z-50 w-full px-4 sm:px-6 lg:px-14 py-3 fixed top-0 left-0 right-0 ',
      showBackground
        ? 'bg-black/80 backdrop-blur-md border-b border-white/5'
        : 'bg-transparent border-transparent',
    ]"
  >
    <div
      class="w-full max-w-7xl mx-auto flex items-center justify-between"
    >
      <!-- Logo (izquierda) -->
      <RouterLink to="/" class="flex items-center gap-2 shrink-0">
        <div
          class="w-9 h-9 sm:w-10 sm:h-10 border border-white/30 flex items-center justify-center overflow-hidden"
        >
          <img
            src="/img/navbar/profile.png"
            alt="Logo"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="leading-none">
          <p
            class="text-[12px] sm:text-[11px] tracking-[0.28em] font-medium text-white/90"
          >
            STUDIO
          </p>
          <p
            class="text-[8px] sm:text-[8px] tracking-[0.38em] text-[#ffb700] mt-1"
          >
            SILHOUETTE
          </p>
        </div>
      </RouterLink>

      <!-- Menú de laptop -->
      <Laptop />

      <!-- Grupo derecha: Reservar cita + Hamburguesa -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0 ">
        <!-- Reservar cita (solo cliente o sin sesión) -->
        <button
          v-if="!user.isAdmin && !user.isBarber"
          @click="checkAuthAndShowWarning"
          class="group flex items-center gap-2 text-black bg-[#ffb700] hover:bg-[#e6a500] text-[10px] font-barber font-semibold uppercase tracking-[0.1em] rounded-xl transition-all duration-300 shrink-0 hover:shadow-[0_8px_30px_rgba(255,183,0,0.35)] active:scale-95"
          :class="user.isAuthenticated ? 'px-2.5 py-1.5 md:px-4 md:py-2' : 'px-4 py-2'"
        >
          Reservar cita
          <span
            class="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </button>

        <!-- Hamburguesa (móvil logueado) -->
        <div
          v-if="user.isAuthenticated"
          class="relative lg:hidden flex items-center "
        >
          <button
            type="button"
            @click.stop="mobileMenuOpen = !mobileMenuOpen"
            class="w-5 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Menú de usuario"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>

          <!-- OVERLAY -->
          <div
            v-if="mobileMenuOpen"
            class="fixed inset-0 z-40"
            @click="mobileMenuOpen = false"
          />

          <!-- DROPDOWN -->
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="mobileMenuOpen"
              class="absolute top-full right-0 mt-3 w-64 bg-[#0b0b0b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 z-50"
            >
              <!-- Usuario -->
              <div
                class="flex items-center gap-3 px-5 py-4 border-b border-white/5"
              >
                <span
                  class="w-10 h-10 shrink-0 rounded-full border border-[#ffb700]/30 bg-[#ffb700]/5 flex items-center justify-center text-[#ffb700] text-sm font-barber"
                >
                  {{ user.getUserName?.charAt(0)?.toUpperCase() || "C" }}
                </span>

                <div class="min-w-0">
                  <p class="text-white/90 text-sm font-barber truncate">
                    {{ user.getUserName || "Cliente" }}
                  </p>
                  <p class="text-white/35 text-[11px] truncate mt-0.5">
                    {{ user.user?.email || "" }}
                  </p>
                </div>
              </div>

              <!-- Cerrar sesión -->
              <button
                type="button"
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-5 py-3.5 text-red-400/80 hover:text-red-300 hover:bg-red-500/5 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.6"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span
                  class="text-[10px] uppercase tracking-[0.2em] font-medium"
                >
                  Cerrar sesión
                </span>
              </button>
            </div>
          </Transition>
        </div>

        <!-- Saludo (solo laptop) -->
        <div
          v-if="user.isAuthenticated"
          class="hidden lg:flex items-center gap-3"
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
import { computed, ref, watch } from "vue";
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
const mobileMenuOpen = ref(false);

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

const handleLogout = () => {
  mobileMenuOpen.value = false;
  user.logout();
};

// Cerrar el menú al cambiar de ruta
watch(
  () => route.name,
  () => {
    mobileMenuOpen.value = false;
  },
);
</script>

<style scoped></style>
