<template>
  <nav
    class="lg:hidden fixed left-3 right-3 bottom-3 z-50 rounded-2xl border border-white/10 bg-black/95 shadow-2xl shadow-black/60"
  >
    <div class="flex items-stretch h-[62px]">
      <!-- INICIO -->
      <RouterLink
        :to="{ name: 'Home' }"
        class="relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-1 transition-colors"
        :class="route.name === 'Home' ? 'text-[#ffb700]' : 'text-white/45'"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
        <span class="text-[7px] uppercase tracking-[0.08em] font-medium leading-none">Inicio</span>
        <span v-if="route.name === 'Home'" class="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#ffb700] rounded-full" />
      </RouterLink>

      <!-- SERVICIOS (único con bloqueo cuando no hay sesión) -->
      <RouterLink
        :to="{ name: 'Services' }"
        class="relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-1 transition-colors"
        :class="[
          isServicesRoute ? 'text-[#ffb700]' : 'text-white/45',
          !user.user ? 'opacity-30 pointer-events-none' : '',
        ]"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
        <span class="text-[7px] uppercase tracking-[0.08em] font-medium leading-none">Servicios</span>
        <span v-if="isServicesRoute" class="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#ffb700] rounded-full" />
      </RouterLink>

      <!-- NOSOTROS -->
      <RouterLink
        :to="{ name: 'History' }"
        class="relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-1 transition-colors"
        :class="route.name === 'History' ? 'text-[#ffb700]' : 'text-white/45'"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text-[7px] uppercase tracking-[0.08em] font-medium leading-none">Nosotros</span>
        <span v-if="route.name === 'History'" class="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#ffb700] rounded-full" />
      </RouterLink>

      <!-- CONTACTO -->
      <RouterLink
        :to="{ name: 'Contact' }"
        class="relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-1 transition-colors"
        :class="route.name === 'Contact' ? 'text-[#ffb700]' : 'text-white/45'"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span class="text-[7px] uppercase tracking-[0.08em] font-medium leading-none">Contacto</span>
        <span v-if="route.name === 'Contact'" class="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#ffb700] rounded-full" />
      </RouterLink>

      <!-- ADMINISTRACIÓN -->
      <RouterLink
        v-if="user.user?.admin"
        :to="{ name: 'Admin' }"
        class="relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-1 transition-colors"
        :class="isAdminRoute ? 'text-[#ffb700]' : 'text-white/45'"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-[7px] uppercase tracking-[0.08em] font-medium leading-none">Admin</span>
        <span v-if="isAdminRoute" class="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#ffb700] rounded-full" />
      </RouterLink>

      <!-- CERRAR SESIÓN -->
      <button
        v-if="user.user"
        type="button"
        @click="user.logout"
        class="relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-1 text-red-400/70 hover:text-red-400 transition-colors"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="text-[7px] uppercase tracking-[0.08em] font-medium leading-none">Salir</span>
      </button>

      <!-- INICIAR SESIÓN -->
      <RouterLink
        v-else
        :to="{ name: 'Login' }"
        class="relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-1 text-[#ffb700] transition-colors"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <span class="text-[7px] uppercase tracking-[0.08em] font-medium leading-none">Entrar</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const user = useUserStore();

const isServicesRoute = computed(() =>
  [
    "Services",
    "Reservaciones",
    "My-appointments",
    "BarberSelect",
    "New-appointments",
    "New-Appointments-details",
  ].includes(route.name as string),
);

const isAdminRoute = computed(() =>
  ["Admin", "Admin-appointments", "Admin-Home"].includes(route.name as string),
);
</script>