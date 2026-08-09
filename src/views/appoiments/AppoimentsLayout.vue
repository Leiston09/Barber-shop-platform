<template>
  <div class="flex justify-between">
    <h1 class="text-2xl md:text-5xl font-black text-white">App Salon</h1>
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 justify-center items-center">
        <h1 class="text-white">Hola: {{ user.getUserName }}</h1>

        <button
        @click="user.logout"
          type="button"
          class="bg-red-400 text-white text-xs font-extrabold p-2 uppercase rounded-xl"
        >
          CERRAR SESIÓN
        </button>
      </div>

      <nav class="flex justify-end items-center">
        <RouterLink
          :to="{ name: 'My-appoiments' }"
          class="text-white p-3 text-xs font-extrabold uppercase"
        >
          MIS CITAS
        </RouterLink>
        <RouterLink
          :to="{ name: 'new-appoiments' }"
          class="text-white p-3 text-xs font-extrabold uppercase bg-blue-500 rounded-xl"
          >NUEVA CITA</RouterLink
        >
      </nav>
    </div>
  </div>

  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const user = useUserStore();
</script>

<style scoped></style>
