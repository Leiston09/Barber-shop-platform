<template>
  <div class="">
    <!-- HEADER DE RESERVACIONES -->
    <header class="border-b  border-white/5 px-6 sm:px-10 lg:px-14 py-2">
      <div
        class="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7"
      >
        <!-- TÍTULO -->
        <div>
          <RouterLink to="/" class="inline-block group">
            <h1
              class="font-barber text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-tight transition-colors duration-300 group-hover:text-white/90"
            >
              Mis
              <span class="text-[#ffb700] font-medium">
                Reservaciones
              </span>
            </h1>

            <div class="flex items-center gap-2 mt-2">

              <p
                class="text-white/30 text-[9px] uppercase tracking-[0.3em]"
              >
                The Barber Studio
              </p>
            </div>
          </RouterLink>
        </div>

        <!-- USUARIO + NAVEGACIÓN -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-end gap-5 sm:gap-8"
        >

          <!-- NAVEGACIÓN -->
          <nav
            class="flex items-center p-1 bg-white/[0.025] border border-white/5 rounded-lg w-fit"
          >
            <RouterLink
              :to="{ name: 'My-appointments' }"
              class="relative px-5 py-2.5 text-[9px] font-barber uppercase tracking-[0.2em] rounded-md transition-all duration-300"
              :class="
                route.name === 'My-appointments'
                  ? 'bg-[#ffb700] text-black shadow-[0_0_20px_rgba(255,183,0,0.08)]'
                  : 'text-white/40 hover:text-white/80'
              "
            >
              Mis Citas
            </RouterLink>

            <RouterLink
              :to="{ name: 'BarberSelect' }"
              class="relative px-5 py-2.5 text-[9px] font-barber uppercase tracking-[0.2em] rounded-md transition-all duration-300"
              :class="
                route.name !== 'My-appointments'
                  ? 'bg-[#ffb700] text-black shadow-[0_0_20px_rgba(255,183,0,0.08)]'
                  : 'text-white/40 hover:text-white/80'
              "
            >
              Nueva Cita
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- CONTENIDO -->
    <main
      class="max-w-7xl mx-auto py-5 px-5 "
    >
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
const route = useRoute();
</script>

<style scoped></style>