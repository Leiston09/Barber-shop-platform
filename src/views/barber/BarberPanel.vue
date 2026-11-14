<template>
  <div class="mx-auto w-full max-w-7xl flex-1 px-4 py-4 text-white sm:px-8 lg:px-12">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div><p class="text-sm text-white/45">Panel del barbero</p><h1 class="mt-1 font-barber text-3xl sm:text-4xl">Mi agenda</h1></div>
      <div class="hidden text-right sm:block"><p class="text-sm text-white/80">{{ user.user?.name }}</p><p class="mt-1 text-xs text-white/40">Solo tus reservas web y tu disponibilidad</p></div>
    </header>
    <nav aria-label="Secciones de mi agenda" class="my-5 grid w-fit max-w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-[#111111] p-1 sm:flex">
      <RouterLink v-for="item in sections" :key="item.name" :to="{ name: item.name }" class="flex min-h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-center text-xs transition-colors duration-150 sm:text-sm focus-visible:outline-2 focus-visible:outline-[#ffb700]" :class="$route.name === item.name ? 'bg-[#ffb700] font-semibold text-black' : 'text-white/55 hover:bg-white/5 hover:text-white'">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="size-4 shrink-0"><path :d="item.icon" stroke-linecap="round" stroke-linejoin="round" /></svg>{{ item.label }}
      </RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const user = useUserStore();
const sections = [
  { name: "Barber-Today", label: "Citas de hoy", icon: "M8 3v4m8-4v4M4 10h16M5 5h14v16H5zM8 14h3m-3 3h7" },
  { name: "Barber-Appointments", label: "Mis citas", icon: "M8 5h12M8 12h12M8 19h12M3 5h.01M3 12h.01M3 19h.01" },
  { name: "Barber-Performance", label: "Mi rendimiento", icon: "M4 4v16h16M8 16v-4m4 4V8m4 8V5" },
  { name: "Barber-Schedule", label: "Mi horario", icon: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" },
];
</script>
