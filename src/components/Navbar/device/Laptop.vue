<template>
  <nav class="hidden lg:flex items-center gap-8">
    <!-- INICIO -->
    <RouterLink
      :to="{ name: 'Home' }"
      class="relative px-1 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
      :class="route.name === 'Home' ? 'text-white' : 'text-white/60 hover:text-white'"
    >
      Inicio
      <span
        class="absolute bottom-0 left-0 right-0 mx-auto h-px bg-[#ffb700] transition-all duration-300"
        :class="route.name === 'Home' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
      />
    </RouterLink>

    <!-- SERVICIOS (único con bloqueo cuando no hay sesión) -->
    <RouterLink
      :to="{ name: 'Services' }"
      class="relative px-1 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
      :class="user.user ? 'text-white/60 hover:text-white' : 'text-white/20 pointer-events-none blur-[1px] select-none'"
    >
      Servicios
      <span
        v-if="user.user"
        class="absolute bottom-0 left-0 right-0 mx-auto h-px bg-[#ffb700] transition-all duration-300"
        :class="isServicesRoute ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
      />
    </RouterLink>

    <!-- NOSOTROS -->
    <RouterLink
      :to="{ name: 'History' }"
      class="relative px-1 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 text-white/60 hover:text-white"
    >
      Nosotros
      <span
        class="absolute bottom-0 left-0 right-0 mx-auto h-px bg-[#ffb700] transition-all duration-300"
        :class="route.name === 'History' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
      />
    </RouterLink>

    <!-- CONTACTO -->
    <RouterLink
      :to="{ name: 'Contact' }"
      class="relative px-1 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 text-white/60 hover:text-white"
    >
      Contacto
      <span
        class="absolute bottom-0 left-0 right-0 mx-auto h-px bg-[#ffb700] transition-all duration-300"
        :class="route.name === 'Contact' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
      />
    </RouterLink>

    <span class="text-[10px] text-white/20">|</span>

    <!-- ADMINISTRACIÓN -->
    <RouterLink
      v-if="user.user?.admin"
      :to="{ name: 'Admin' }"
      class="relative px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.20em] text-white/60 transition-all duration-300"
      :class="isAdminRoute ? 'text-[#ffb700] border border-[#ffb700]/50' : 'hover:text-[#ffb700]'"
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

<style scoped></style>