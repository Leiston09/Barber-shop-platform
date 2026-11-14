<template>
  <div class="app-shell flex flex-col bg-[#050505] text-white">
    <a href="#admin-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-[#ffb700] focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-black">Ir al contenido</a>

    <header data-app-navbar class="sticky top-0 z-40 border-b border-white/10 bg-[#090909]/95 backdrop-blur-md">
      <div class="mx-auto w-full max-w-7xl px-4 sm:px-10 lg:px-14">
        <div class="flex items-center justify-between gap-3 py-3 sm:py-4">
          <RouterLink :to="{ name: 'Admin-Home' }" aria-label="The Barber Studio, resumen de administración"
            class="flex min-w-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] sm:gap-3">
            <SiteImage slot="logo" alt="" width="40" height="40" class="size-9 shrink-0 object-contain sm:size-10" />
            <div class="min-w-0">
              <p class="truncate font-barber text-lg leading-tight text-white sm:text-xl">Administración</p>
              <p class="mt-1 truncate text-[10px] leading-4 text-white/50 sm:text-xs">The Barber Studio</p>
            </div>
          </RouterLink>

          <div class="flex shrink-0 items-center gap-2 sm:gap-3">
            <RouterLink :to="{ name: 'Home' }" aria-label="Volver al inicio"
              class="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-xs text-white/65 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] motion-reduce:transition-none">
              <svg aria-hidden="true" class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
              </svg>
              <span class="hidden sm:inline">Volver al inicio</span>
            </RouterLink>
            <AccountMenu />
          </div>
        </div>

        <nav aria-label="Administración del salón" class="flex flex-wrap gap-1 pb-3 sm:gap-1.5">
          <RouterLink v-for="section in sections" :key="section.name" :to="{ name: section.name }"
            :aria-current="route.name === section.name ? 'page' : undefined"
            class="flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] motion-reduce:transition-none sm:min-h-11 sm:flex-row sm:gap-2 sm:px-3 sm:text-xs"
            :class="route.name === section.name ? 'border-[#ffb700]/25 bg-[#ffb700]/10 text-[#ffb700]' : 'border-transparent text-white/60 hover:border-white/10 hover:bg-white/5 hover:text-white'">
            <svg aria-hidden="true" class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path :d="section.icon" />
            </svg>
            <span>{{ section.label }}</span>
          </RouterLink>
        </nav>
      </div>
    </header>

    <main id="admin-content" tabindex="-1" class="mx-auto w-full max-w-7xl flex-1 scroll-mt-40 px-5 py-6 focus:outline-none sm:px-10 lg:px-14">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import SiteImage from "@/components/UI/SiteImage.vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import AccountMenu from "@/components/Navbar/AccountMenu.vue";

import { computed } from "vue";
import { useUserStore } from "@/stores/user";
const user = useUserStore();
const route = useRoute();
const sections = computed(() => [
  { name: "Admin-Home", label: "Resumen", icon: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z" },
  { name: "Admin-Appointments", label: "Citas", icon: "M8 3v4m8-4v4M3 11h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" },
  { name: "Admin-Barbers", label: "Barberos", icon: "M8 8 20 20M14 10l6-6M8 16 20 4M8.5 6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" },
  { name: "Admin-Customer", label: "Clientes", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M13 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" },
  { name: "Admin-Services", label: "Servicios", icon: "M9 5h6m-6 0V3h6v2m-6 0H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3M8 11h8m-8 5h5" },
  { name: "Admin-Promotions", label: "Promociones", icon: "M20 13 13 20 3 10V3h7l10 10ZM7 7h.01" },
  { name: "Admin-Settings", label: "Configuración", icon: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2" },
  { name: "Admin-SiteImages", label: "Imágenes del sitio", icon: "M3 3h18v18H3ZM3 17l5-5 4 4 3-3 6 6M9 8h.01" },
  ...(user.isPrincipalAdmin ? [{ name: "Admin-Database", label: "Base de datos", icon: "M3 5c0-2 18-2 18 0v14c0 2-18 2-18 0ZM3 5c0 3 18 3 18 0M3 12c0 3 18 3 18 0" }] : []),
]);
</script>
