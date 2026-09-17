<template>
  <div class="min-h-screen bg-[#050505] text-white">
    <header class="border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-6">
        <div
          class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div class="flex items-center gap-3 mb-3">
              <span
                class="text-[#ffb700] text-[9px] uppercase tracking-[0.35em] font-medium"
              >
                Administración
              </span>
            </div>

            <h1
              class="font-barber text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white"
            >
              Panel de
              <span class="text-[#ffb700] font-medium"> Administración </span>
            </h1>

            <p
              class="text-white/35 text-xs sm:text-sm font-light mt-2 tracking-wide"
            >
              Gestiona y supervisa la información de la plataforma.
            </p>
          </div>

          <div
            class="flex items-center justify-between lg:justify-end gap-3 sm:gap-5"
          >
            <div class="text-left lg:text-right">
              <p
                class="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-1"
              >
                Sesión activa
              </p>

              <p class="text-sm text-white/80 font-light tracking-wide">
                {{ user.getUserName }}
              </p>
            </div>

            <RouterLink
              v-if="nameRouter"
              :to="{ name: 'Home' }"
              class="px-4 py-2.5 border border-[#ffb700]/70 text-[#ffb700] hover:text-white hover:border-[#ffb700] hover:bg-[#ffb700]/5 text-[9px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
            >
              Salir de Admin
            </RouterLink>

            <RouterLink
              v-else
              :to="{ name: 'Admin' }"
              class="px-4 py-2.5 border border-[#ffb700]/70 text-[#ffb700] hover:text-white hover:border-[#ffb700] hover:bg-[#ffb700]/5 text-[9px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
            >
              Volver
            </RouterLink>

            <button
              type="button"
              @click="user.logout"
              class="px-4 py-2.5 border border-red-500/20 text-red-400/80 hover:text-white hover:border-red-500/50 hover:bg-red-500/5 text-[9px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-5">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { computed } from "vue";

const route = useRoute();
const user = useUserStore();

const nameRouter = computed(() => {
  return route.name === 'Admin-Home' ? true : false
})


</script>

<style scoped></style>
